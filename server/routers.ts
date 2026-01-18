import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { transcribeAudio } from "./_core/voiceTranscription";
import { storagePut } from "./storage";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  transcription: router({
    transcribeAudio: publicProcedure
      .input(
        z.object({
          audioUrl: z.string().url(),
          language: z.string().optional(),
          prompt: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await transcribeAudio({
            audioUrl: input.audioUrl,
            language: input.language,
            prompt: input.prompt,
          });

          // Handle both success and error responses from Whisper API
          if ("error" in result) {
            throw new Error(result.error as string);
          }

          return {
            success: true,
            text: result.text || "",
            language: (result as any).language,
            segments: (result as any).segments,
          };
        } catch (error) {
          console.error("Transcription error:", error);
          throw new Error(
            `Transcription failed: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }),
  }),

  storage: router({
    uploadFile: publicProcedure
      .input(
        z.object({
          fileName: z.string(),
          fileData: z.string(),
          mimeType: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const buffer = Buffer.from(input.fileData, "base64");
          const randomSuffix = Math.random().toString(36).substring(7);
          const fileKey = `audio/${Date.now()}-${randomSuffix}-${input.fileName}`;
          const { url } = await storagePut(fileKey, buffer, input.mimeType);
          return {
            success: true,
            url,
          };
        } catch (error) {
          console.error("Storage upload error:", error);
          throw new Error(
            `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
