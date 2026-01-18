# SomaSyncAi TODO

## MVP Features (v0.1)

### Core Screens
- [x] Home/Dashboard screen with "Start New Session" button
- [x] Recent sessions list on home screen
- [x] Session setup screen with client name input
- [x] Session type selector (Initial Assessment / Follow-up / Maintenance)
- [x] Active session screen with recording interface
- [x] Recording indicator (pulsing animation)
- [x] Session timer display
- [x] Manual "Mark Finding" button
- [x] Live transcription preview (simulated)
- [x] End session button
- [x] Session review screen with SOAP note
- [x] Editable SOAP note sections (S, O, A, P)
- [ ] Session timeline with timestamps
- [x] Session history screen with searchable list
- [x] Settings screen with basic preferences

### Audio Recording
- [x] Request microphone permissions
- [x] Local audio recording with expo-audio
- [x] Start/stop recording functionality
- [ ] Audio file storage in local filesystem
- [x] Session duration tracking

### Data Management
- [x] Session data model (client name, date, duration, findings)
- [x] Local storage with AsyncStorage
- [x] Save session metadata
- [x] Load session history
- [x] Delete session functionality

### SOAP Note Generation
- [x] Template-based SOAP note structure
- [x] Auto-populate findings from marked timestamps
- [x] Editable text fields for each section
- [ ] Export as PDF
- [x] Export as TXT

### Navigation
- [x] Tab navigation (Home, History, Settings)
- [x] Screen transitions between session flow
- [x] Back navigation handling

### UI/UX Polish
- [x] Theme colors implementation
- [x] Dark mode support
- [x] Haptic feedback for key actions
- [x] Loading states
- [x] Error handling and user feedback
- [x] Empty states (no sessions yet)

### Branding
- [x] Generate custom app logo
- [x] Update app.config.ts with app name and logo
- [x] Update splash screen
- [x] Update app icons

## Post-MVP Features (Deferred)

- [ ] Real-time cloud transcription
- [ ] Advanced voice command detection
- [ ] AI-powered SOAP note generation with LLM
- [ ] Audio snippet playback linked to note sections
- [ ] Cloud storage and sync
- [ ] Multi-therapist accounts
- [ ] Integration with practice management systems
- [ ] Client portal with homecare videos
- [ ] Treatment progression tracking
- [ ] Outcomes dashboard


## Speech-to-Text Integration (Completed)

- [x] Integrate real-time speech-to-text API (Whisper via tRPC)
- [x] Stream audio from recording to transcription service
- [x] Display live transcription in active session
- [x] Parse voice commands (mark, note, pain, referral, etc.)
- [x] Auto-extract findings from transcribed text
- [x] Handle transcription errors and retry logic
- [x] Add transcription language selection
