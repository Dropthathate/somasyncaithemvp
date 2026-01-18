# SomaSyncAi Mobile App Design Plan

## Design Philosophy

SomaSyncAi is designed for **massage therapists and manual clinicians** who need **hands-free clinical documentation** during sessions. The app must feel like a professional clinical tool that respects the therapeutic environment while providing powerful AI-assisted documentation capabilities.

The interface assumes **mobile portrait orientation (9:16)** and **one-handed usage** when possible, following **Apple Human Interface Guidelines** to feel like a first-party iOS app.

## Screen List

### 1. Home / Dashboard
**Purpose**: Quick access to start new sessions and view recent activity  
**Primary Content**:
- Large "Start New Session" button (primary action)
- Recent sessions list (client name, date, duration)
- Quick stats (sessions this week, total time saved)

**Functionality**:
- Tap to start new session → navigates to Session Setup
- Tap recent session → view session details

### 2. Session Setup
**Purpose**: Configure session before starting recording  
**Primary Content**:
- Client name input field
- Session type selector (Initial Assessment / Follow-up / Maintenance)
- Optional notes field
- "Begin Recording" button

**Functionality**:
- Input client information
- Start audio recording and transcription
- Navigate to Active Session screen

### 3. Active Session
**Purpose**: Hands-free session recording with voice commands  
**Primary Content**:
- Recording indicator (pulsing red dot)
- Live transcription preview (scrolling text)
- Timer showing session duration
- Large "Mark Finding" button
- Voice command hints ("Say 'mark' to flag findings")
- "End Session" button (bottom)

**Functionality**:
- Continuous audio recording
- Real-time speech-to-text
- Voice command detection ("mark", "note", "pain", etc.)
- Manual tap to mark findings
- End session → navigate to Review screen

### 4. Session Review
**Purpose**: Review AI-generated SOAP note and edit before saving  
**Primary Content**:
- Auto-generated SOAP note sections:
  - Subjective (client feedback)
  - Objective (anatomical findings)
  - Assessment (analysis)
  - Plan (treatment recommendations)
- Session timeline with audio snippets
- Edit button for each section
- "Save & Export" button

**Functionality**:
- Review AI-generated content
- Edit any section
- Play audio snippets linked to note sections
- Export as PDF or TXT
- Save to session history

### 5. Session History
**Purpose**: Browse all past sessions  
**Primary Content**:
- Searchable list of sessions
- Filter by client name, date range
- Each item shows: client name, date, duration, preview of findings

**Functionality**:
- Search and filter sessions
- Tap to view full session details
- Export individual sessions

### 6. Settings
**Purpose**: App configuration and preferences  
**Primary Content**:
- Audio settings (microphone selection, quality)
- Transcription settings (language, speaker labeling)
- Export preferences (default format)
- Data retention policy
- Privacy settings (cloud storage opt-out)
- About / Help

**Functionality**:
- Configure app behavior
- Manage data privacy
- Access help documentation

## Key User Flows

### Flow 1: Start New Session
1. User opens app → Home screen
2. Taps "Start New Session"
3. Enters client name and session type → Session Setup
4. Taps "Begin Recording"
5. Active Session screen with live transcription
6. During session: says "mark: left levator scapulae tension" or taps "Mark Finding"
7. Taps "End Session"
8. AI generates SOAP note → Session Review screen
9. Reviews, edits if needed
10. Taps "Save & Export"
11. Returns to Home with updated history

### Flow 2: Review Past Session
1. User opens app → Home screen
2. Taps on recent session OR navigates to Session History tab
3. Views full SOAP note and session details
4. Plays audio snippets linked to specific findings
5. Exports as PDF if needed

### Flow 3: Voice Command During Session
1. Active Session screen is open
2. Therapist says "mark: decreased right shoulder abduction to 90 degrees"
3. App detects "mark" trigger word
4. Transcribes and timestamps the finding
5. Shows brief confirmation (haptic feedback + visual indicator)
6. Continues recording

## Color Choices

**Brand Identity**: Professional clinical tool with modern, calming aesthetics

- **Primary**: `#0A7EA4` (Teal Blue) - Professional, trustworthy, medical
- **Background Light**: `#FFFFFF` (White) - Clean, clinical
- **Background Dark**: `#151718` (Dark Gray) - Reduces eye strain in dim treatment rooms
- **Surface Light**: `#F5F5F5` (Light Gray) - Subtle elevation
- **Surface Dark**: `#1E2022` (Darker Gray) - Card backgrounds
- **Foreground Light**: `#11181C` (Near Black) - Primary text
- **Foreground Dark**: `#ECEDEE` (Off White) - Primary text in dark mode
- **Muted Light**: `#687076` (Gray) - Secondary text
- **Muted Dark**: `#9BA1A6` (Light Gray) - Secondary text in dark mode
- **Success**: `#22C55E` / `#4ADE80` - Session saved, export successful
- **Warning**: `#F59E0B` / `#FBBF24` - Low storage, microphone issues
- **Error**: `#EF4444` / `#F87171` - Recording failed, transcription error

## Layout Patterns

### Recording Indicator
- Pulsing red dot (top center) during active recording
- Timer below indicator
- Always visible, never obscured

### Voice Command Hints
- Subtle bottom sheet or floating card
- Shows common commands: "mark", "note", "pain", "referral"
- Dismissible but easily accessible

### Session Timeline
- Vertical timeline with timestamps
- Audio waveform snippets
- Tappable to play audio
- Linked to corresponding SOAP note sections

### SOAP Note Display
- Clear section headers (S, O, A, P)
- Editable text fields
- Linked audio snippets (play icon next to relevant findings)
- Export button (top right)

## Technical Considerations

### Audio Recording
- Use `expo-audio` for microphone access
- Request microphone permissions on first session
- Local recording with option for cloud backup
- Audio format: M4A or MP3 for compatibility

### Speech-to-Text
- For MVP: Use device-based speech recognition (iOS Speech framework via Expo)
- Post-MVP: Integrate cloud-based transcription (Whisper API or similar)
- Real-time streaming transcription
- Speaker diarization (distinguish therapist from client)

### Voice Command Detection
- Simple keyword matching for MVP ("mark", "note", "pain", etc.)
- Trigger words followed by colon indicate finding annotation
- Example: "mark: left levator scapulae tension" → extracts "left levator scapulae tension"

### AI SOAP Note Generation
- For MVP: Use template-based generation with extracted findings
- Post-MVP: Use LLM (via backend) to generate comprehensive SOAP notes
- Parse transcription for anatomical terms, pain descriptors, ROM measurements
- Structure into S.O.A.P. format

### Data Storage
- Local storage (AsyncStorage) for session metadata
- Audio files stored locally (Expo FileSystem)
- Optional cloud backup (user opt-in)
- HIPAA-aware: encryption at rest, secure transmission

### Privacy & Compliance
- Clear consent flow before first recording
- Option to keep sessions local-only (no cloud upload)
- Data retention settings (30/90/365 days)
- Export and delete functionality

## MVP Scope (v0.1)

For the initial MVP, we will implement:

1. **Home Screen** with "Start New Session" and recent sessions list
2. **Session Setup** with client name input
3. **Active Session** with:
   - Audio recording (local)
   - Live transcription preview (simulated for MVP, real in post-MVP)
   - Manual "Mark Finding" button (voice commands in post-MVP)
   - Session timer
4. **Session Review** with:
   - Basic SOAP note template (auto-populated with marked findings)
   - Editable sections
   - Session timeline with timestamps
5. **Session History** with list of past sessions
6. **Settings** with basic preferences

**Deferred to Post-MVP**:
- Real-time cloud transcription (use local device speech recognition for MVP)
- Advanced voice command detection (use manual button for MVP)
- AI-powered SOAP note generation (use template-based for MVP)
- Audio snippet playback linked to note sections
- Cloud storage and sync
- Multi-therapist accounts
- Integration with practice management systems

## Design System

### Typography
- Headers: SF Pro Display (iOS native), Roboto (Android)
- Body: SF Pro Text (iOS native), Roboto (Android)
- Sizes: 32px (hero), 24px (h1), 18px (h2), 16px (body), 14px (caption)

### Spacing
- Base unit: 4px
- Common spacing: 8px, 12px, 16px, 24px, 32px

### Border Radius
- Small: 8px (buttons, inputs)
- Medium: 12px (cards)
- Large: 16px (modals, sheets)

### Shadows
- Subtle elevation for cards
- No heavy shadows (keep clinical, professional feel)

### Iconography
- SF Symbols (iOS) / Material Icons (Android)
- Consistent 24px size for tab bar and action buttons
- 16px for inline icons

## Accessibility

- High contrast text (WCAG AA compliant)
- Large touch targets (minimum 44x44pt)
- VoiceOver / TalkBack support
- Dynamic type support
- Haptic feedback for key actions

## Performance Considerations

- Optimize audio recording for battery efficiency
- Lazy load session history (pagination)
- Compress audio files for storage efficiency
- Background audio handling (continue recording if app backgrounded)
