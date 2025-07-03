# tRPC Router Structure

This directory contains the tRPC router configuration organized in a modular structure for better maintainability and organization.

## File Structure

```
src/server/trpc/
├── lib.ts                 # Shared tRPC configuration and utilities
├── router.ts              # Main router that combines all sub-routers
├── routers/               # Individual domain-specific routers
│   ├── profile.ts         # User profile management
│   ├── award.ts           # Award creation and management
│   └── application.ts     # Award application management
└── README.md              # This documentation
```

## Architecture

### lib.ts

Contains shared tRPC configuration including:

- Context creation function
- tRPC instance with superjson transformer
- Shared procedures (publicProcedure)
- Helper functions like `getAuthenticatedSession()`

### router.ts (Main Router)

The main router that combines all sub-routers:

- Imports individual routers from the `routers/` directory
- Exports the combined `appRouter` and types
- Keeps the main file clean and focused

### Individual Routers

#### profile.ts

Handles user profile operations:

- `getProfile` - Get current user's profile
- `updateProfile` - Update user profile
- `createProfile` - Create new profile
- `getRoles` - Get available user roles

#### award.ts

Manages award creation and administration:

- `createAward` - Create new award template
- `getAwards` - List published awards
- `getAward` - Get single award details
- `updateAward` - Edit award (creator only)
- `publishAward` - Publish award for applications
- `getMyAwards` - Get user's created awards
- `deleteAward` - Delete award (if no applications)

#### application.ts

Handles award applications:

- `submitApplication` - Submit award application
- `getMyApplications` - Get user's applications
- `getApplication` - Get single application details
- `saveDraft` - Save draft application

## Benefits of This Structure

1. **Maintainability**: Each router focuses on a specific domain
2. **Scalability**: Easy to add new routers as the application grows
3. **Code Organization**: Related procedures are grouped together
4. **Reusability**: Shared utilities in `lib.ts` can be used across routers
5. **Type Safety**: Full TypeScript support maintained across all files

## Adding New Routers

To add a new router:

1. Create a new file in `routers/` directory (e.g., `routers/notification.ts`)
2. Import shared utilities from `../lib`
3. Define your procedures using the shared configuration
4. Export your router
5. Import and add to the main router in `router.ts`

Example:

```typescript
// routers/notification.ts
import { router, publicProcedure, getAuthenticatedSession } from '../lib';

export const notificationRouter = router({
    getNotifications: publicProcedure.query(async ({ ctx }) => {
        const session = await getAuthenticatedSession(ctx);
        // Implementation
    }),
});

// router.ts
import { notificationRouter } from './routers/notification';

export const appRouter = router({
    // ... existing routers
    notification: notificationRouter,
});
```

## Authentication

All routers use the shared `getAuthenticatedSession()` helper function which:

- Extracts session from request headers
- Validates user authentication
- Throws error if unauthorized
- Returns authenticated session for use in procedures

This ensures consistent authentication handling across all routers.
