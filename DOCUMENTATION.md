# rstart - Project Rules & Documentation

## Project Overview

rstart is a modern full-stack boilerplate designed to streamline web application development with a focus on type safety, developer experience, and scalability. It integrates the latest technologies in the React ecosystem with an opinionated structure that follows best practices.

## Project Rules

To maintain consistency and quality throughout the project lifecycle, all team members must adhere to the following rules:

### Code Organization Rules

1. **File Structure Enforcement**:

    - All server-side code MUST be located in the `src/server/` directory
    - All client components MUST be placed in appropriate directories under `src/app/`
    - Shared utilities MUST go in `src/lib/`
    - Context providers MUST be in `src/providers/`
    - Reusable UI components MUST be in `src/components/`
    - Navigation components MUST be in `src/components/navigation/`

2. **Naming Conventions**:

    - Use PascalCase for React components: `UserProfile.tsx`
    - Use camelCase for utilities and hooks: `useFormattedDate.ts`
    - Use kebab-case for CSS files: `button-styles.css`
    - Prefix custom hooks with "use": `useAuthentication.ts`

3. **Module Boundaries**:
    - No direct imports from `src/server/` in client components
    - Access server functionality ONLY through tRPC procedures

### Development Process Rules

1. **Branch Management**:

    - Feature branches must follow pattern: `feature/feature-name`
    - Bug fixes must follow pattern: `fix/issue-description`
    - Always rebase on main before creating a pull request

2. **Commit Guidelines**:

    - Follow Conventional Commits format: `feat: add user authentication`
    - Include issue number when applicable: `fix: resolve login redirect issue (#123)`
    - Keep commits focused on single logical changes

3. **Code Quality Requirements**:
    - All code MUST pass linting before commit (enforced by husky)
    - Unit tests MUST be written for critical business logic
    - Authentication-related changes MUST undergo security review

### API Development Rules

1. **tRPC Implementation**:

    - All procedures MUST be properly typed with Zod schemas for inputs
    - Public procedures MUST be explicit about their exposure
    - Protected procedures MUST include proper session validation
    - Procedures MUST be organized by domain/feature in the router

2. **Database Practices**:
    - Schema changes MUST be done through migrations
    - Foreign keys MUST be properly defined with references
    - Indexes MUST be created for frequently queried fields
    - Sensitive data MUST NEVER be stored in plaintext

### Security Rules

1. **Authentication**:

    - NEVER bypass authentication for protected routes
    - ALWAYS validate user permissions for admin actions
    - NEVER expose sensitive tokens in client-side code
    - Implement proper CSRF protection for all form submissions

2. **Data Handling**:
    - ALWAYS sanitize user inputs server-side
    - NEVER trust client-side validation alone
    - Use content security policies to prevent XSS

### User Interface Rules

1. **Alert System**:

    - NEVER use browser `alert()`, `confirm()`, or `prompt()` functions
    - ALWAYS use shadcn Alert components for user notifications
    - Implement proper alert state management with dismissible alerts
    - Use appropriate alert variants: `default`, `destructive` for errors
    - Auto-dismiss success/info alerts after 8 seconds, keep error/warning alerts until manually dismissed

2. **User Feedback**:
    - Provide immediate visual feedback for all user actions
    - Use loading states for async operations
    - Show progress indicators for long-running tasks
    - Implement proper error boundaries for graceful error handling

### Performance Rules

1. **Frontend Optimization**:

    - Implement proper code-splitting for larger components
    - Optimize images and assets before deployment
    - Use React Server Components where possible to reduce client bundle

2. **Backend Optimization**:
    - Implement proper database indexing
    - Cache expensive query results
    - Use connection pooling for database connections

### Mobile Responsiveness Rules

1. **Mobile-First Design**:

    - Always design for mobile first, then enhance for larger screens
    - Use responsive breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
    - Test on actual mobile devices, not just browser dev tools

2. **Layout Guidelines**:

    - Use `flex-col sm:flex-row` for responsive flex layouts
    - Implement `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for responsive grids
    - Use `w-full sm:w-auto` for responsive button widths
    - Apply `p-4 sm:p-6` for responsive padding

3. **Navigation Requirements**:

    - Implement hamburger menus for mobile navigation
    - Use horizontal scrolling for tab navigation on small screens
    - Ensure touch targets are at least 44px in size

4. **Data Display**:

    - Use card layouts for mobile table alternatives
    - Implement `hidden sm:block` and `block sm:hidden` for responsive content
    - Stack form fields vertically on mobile with appropriate spacing

5. **Dialog and Modal Optimization**:
    - Add `max-h-[90vh] overflow-y-auto` to dialog content
    - Use full-width buttons on mobile: `w-full sm:w-auto`
    - Implement proper button ordering with `order-1 sm:order-2`

## Tech Stack

The project combines the following technologies:

- **Next.js 15+** - React framework with App Router for advanced server/client component architecture
- **tRPC** - End-to-end typesafe APIs without schemas or code generation
- **Drizzle ORM** - Lightweight TypeScript ORM with optimal PostgreSQL integration
- **better-auth** - Modern authentication with support for email/password and admin features
- **Tailwind CSS v4** - Utility-first CSS framework with enhanced features
- **TypeScript** - Full type safety across the entire application
- **ESLint & Prettier** - Code quality and formatting enforced via pre-commit hooks
- **pnpm** - Fast, disk space efficient package manager (required for this project)
- **shadcn/ui** - Modern, accessible component library built on Radix UI
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

## Project Structure

```
rstart/
├── src/
│   ├── app/                 # Next.js App Router pages and API routes
│   │   ├── api/
│   │   │   ├── auth/        # Auth API endpoints
│   │   │   └── trpc/        # tRPC API handler
│   │   ├── auth/            # Authentication pages
│   │   │   ├── login/       # Login page
│   │   │   └── register/    # Registration page
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── layout.tsx       # Root layout with providers
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── sheet.tsx
│   │   │   └── badge.tsx
│   │   └── navigation/      # Navigation components
│   │       └── navbar.tsx   # Main navigation bar
│   ├── lib/                 # Utility functions and shared code
│   ├── providers/           # React context providers
│   │   ├── theme-provider.tsx  # Theme management
│   │   └── trpc-provider.tsx   # tRPC client setup
│   └── server/              # Server-side code
│       ├── auth/            # Authentication configuration
│       │   ├── client.ts    # Client-side auth hooks
│       │   └── server.ts    # Server-side auth setup
│       ├── db/              # Database schema and connection
│       │   ├── auth-schema.ts  # Authentication tables schema
│       │   ├── index.ts     # Database connection setup
│       │   └── schema.ts    # Application data schema
│       └── trpc/            # tRPC router and procedures
│           ├── lib.ts       # Shared tRPC configuration
│           ├── router.ts    # Main router combining sub-routers
│           └── routers/     # Domain-specific routers
│               ├── profile.ts     # Profile management
│               ├── award.ts       # Award management
│               └── application.ts # Application management
├── drizzle/                 # Database migrations
├── public/                  # Static assets
└── [config files]           # Various configuration files
```

## Core Features

### 1. Type-Safe APIs with tRPC

The project uses tRPC to create end-to-end typesafe APIs without manual schema definition or code generation.

#### Procedure Definition

API endpoints are organized into domain-specific routers in `src/server/trpc/routers/`:

```typescript
// src/server/trpc/routers/profile.ts
import { router, publicProcedure, getAuthenticatedSession } from '../lib';

export const profileRouter = router({
    getProfile: publicProcedure.query(async ({ ctx }) => {
        const session = await getAuthenticatedSession(ctx);
        // Implementation
    }),
});
```

The main router in `src/server/trpc/router.ts` combines all sub-routers:

```typescript
import { profileRouter } from './routers/profile';
import { awardRouter } from './routers/award';
import { applicationRouter } from './routers/application';

export const appRouter = router({
    hello: publicProcedure.query(() => 'Hello world'),
    profile: profileRouter,
    award: awardRouter,
    application: applicationRouter,
});
```

#### Client Usage

Use the tRPC client hooks in your components:

```typescript
'use client';
import { trpc } from '@/providers/trpc-provider';

export function MyComponent() {
    const hello = trpc.hello.useQuery();
    return <div>{hello.data}</div>;
}
```

### 2. Database Management with Drizzle ORM

#### Schema Definition

Define your database schema in `src/server/db/schema.ts`:

```typescript
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    // Add more fields as needed
});
```

#### Database Operations

Use the Drizzle ORM instance to perform database operations:

```typescript
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

// Example query
const getUser = async (id: number) => {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
};
```

#### Migration Workflow

```bash
# Edit your schema in src/server/db/schema.ts
pnpm db:generate  # Generates migration files in ./drizzle
pnpm db:push      # Applies migrations to your database
```

### 3. Authentication with better-auth

The project uses [Better Auth](https://www.better-auth.com/docs/introduction) - a comprehensive, framework-agnostic authentication and authorization framework for TypeScript. Better Auth provides enterprise-grade security features with built-in rate limiting, automatic database management, and extensive plugin ecosystem.

#### Why Better Auth?

Better Auth was chosen for this project because it offers:

- **Framework Agnostic**: Works seamlessly with Next.js and other frameworks
- **Type Safety**: Full TypeScript support with end-to-end type safety
- **Plugin Ecosystem**: Extensive plugins for 2FA, social auth, organizations, etc.
- **Built-in Security**: Rate limiting, CSRF protection, and secure session management
- **Database Agnostic**: Works with PostgreSQL, MySQL, SQLite, and more
- **Admin Features**: Built-in admin panel and user management capabilities

#### Server Configuration

Authentication is configured in `src/server/auth/server.ts`:

```typescript
// Server-side authentication setup
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        usePlural: true,
    }),
    plugins: [
        nextCookies(),
        admin({
            defaultRole: 'user',
            impersonationSessionDuration: 60 * 60 * 24,
        }),
    ],
    // Additional configuration for enhanced security
    rateLimit: {
        window: 60, // 1 minute
        max: 100, // 100 requests per minute
    },
});
```

#### Client Usage

Use authentication hooks in your components:

```typescript
'use client';
import { useSession, signIn, signOut } from '@/server/auth/client';

export function AuthComponent() {
    const session = useSession();

    if (!session.data) {
        return <button onClick={() => signIn()}>Sign In</button>;
    }

    return (
        <div>
            <p>Signed in as {session.data.user.email}</p>
            <button onClick={() => signOut()}>Sign Out</button>
        </div>
    );
}
```

### 4. Navigation System

The project includes a flexible navigation system with the `Navbar` component that adapts based on the current context.

#### Navigation Component

The main navigation component is located at `src/components/navigation/navbar.tsx`:

```typescript
import Navbar from '@/components/navigation/navbar';

// For landing pages
<Navbar variant="landing" />

// For dashboard pages
<Navbar variant="dashboard" />
```

#### Features

- **Responsive Design**: Mobile-first approach with hamburger menu
- **Authentication State**: Automatically shows different options based on login status
- **Role-based Display**: Shows user role badge in dashboard mode
- **Smooth Navigation**: Proper routing with Next.js Link components

### 5. Form Handling with React Hook Form

The project uses React Hook Form with Zod validation for type-safe form handling.

#### Form Setup

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password too short'),
});

export function MyForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
```

## Best Practices

### Adding New Features

#### 1. Adding a New API Endpoint

1. Define your procedure in the router:

```typescript
// src/server/trpc/router.ts
export const appRouter = router({
    existing: publicProcedure.query(...),

    // Add your new procedure
    newFeature: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            // Implementation
            return { result: `Feature ${input.id}` };
        }),
});
```

2. Use the procedure in your component:

```typescript
const result = trpc.newFeature.useQuery({ id: 1 });
```

#### 2. Adding a New Database Model

1. Define the schema in `src/server/db/schema.ts`:

```typescript
export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    price: decimal('price').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

2. Generate and apply migrations:

```bash
pnpm db:generate
pnpm db:push
```

3. Use the model in your code:

```typescript
import { products } from '@/server/db/schema';

// In a tRPC procedure or API route
const allProducts = await db.select().from(products);
```

#### 3. Adding Authentication to a Route

1. Get the user session in your tRPC procedure:

```typescript
import { getUserSession } from '@/server/auth/server';

const protectedRouter = router({
    protectedRoute: publicProcedure.query(async ({ ctx }) => {
        const session = await getUserSession();

        if (!session || !session.user) {
            throw new Error('Unauthorized');
        }

        // Proceed with authenticated logic
        return { user: session.user };
    }),
});
```

#### 4. Adding New shadcn/ui Components

1. Install new components using the shadcn CLI:

```bash
npx shadcn@latest add [component-name]
```

2. Use the component in your code:

```typescript
import { ComponentName } from '@/components/ui/component-name';

export function MyComponent() {
    return <ComponentName />;
}
```

#### 5. Alert System Implementation

1. **Alert State Management**:

```typescript
const [alerts, setAlerts] = useState<
    Array<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
    }>
>([]);

const addAlert = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
) => {
    const id = Date.now().toString();
    setAlerts((prev) => [...prev, { id, type, title, message }]);
    // Auto-remove after 8 seconds for success/info alerts
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            setAlerts((prev) => prev.filter((alert) => alert.id !== id));
        }, 8000);
    }
};

const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
};
```

2. **Alert Display Component**:

```typescript
{alerts.length > 0 && (
    <div className="mb-6 space-y-3">
        {alerts.map((alert) => (
            <Alert
                key={alert.id}
                variant={alert.type === 'error' ? 'destructive' : 'default'}
                className="relative"
            >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                    {alert.title}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAlert(alert.id)}
                        className="h-auto p-0 hover:bg-transparent"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </AlertTitle>
                <AlertDescription>
                    {alert.message}
                </AlertDescription>
            </Alert>
        ))}
    </div>
)}
```

3. **Usage Examples**:

```typescript
// Instead of: alert('Success!');
addAlert('success', 'Success', 'Operation completed successfully!');

// Instead of: alert('Error occurred');
addAlert('error', 'Error', 'Something went wrong. Please try again.');

// Instead of: confirm('Are you sure?') - use Dialog component
```

4. **Confirmation Dialogs**:

For confirmations that previously used `confirm()`, use the shadcn Dialog component:

```typescript
const [showConfirmDialog, setShowConfirmDialog] = useState(false);

// In JSX:
<Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
                Are you sure you want to proceed? This action cannot be undone.
            </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
            >
                Cancel
            </Button>
            <Button
                variant="destructive"
                onClick={handleConfirmedAction}
            >
                Confirm
            </Button>
        </DialogFooter>
    </DialogContent>
</Dialog>
```

#### 6. Mobile Responsiveness Implementation

1. **Responsive Layout Example**:

```typescript
// Mobile-first responsive component
export function ResponsiveComponent() {
    return (
        <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
            <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-semibold">Title</h2>
                <p className="text-sm sm:text-base text-gray-600">Description</p>
            </div>
            <Button className="w-full sm:w-auto">
                Action
            </Button>
        </div>
    );
}
```

2. **Responsive Table/List Pattern**:

```typescript
// Dual layout for mobile and desktop
export function ResponsiveDataDisplay({ items }) {
    return (
        <div className="space-y-4 sm:space-y-0">
            {/* Mobile card layout */}
            <div className="block sm:hidden space-y-4">
                {items.map(item => (
                    <Card key={item.id}>
                        <CardContent className="p-4">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Desktop table layout */}
            <div className="hidden sm:block">
                <table className="w-full">
                    {/* Table content */}
                </table>
            </div>
        </div>
    );
}
```

3. **Responsive Tab Navigation**:

```typescript
// Horizontally scrollable tabs
<div className="overflow-x-auto">
    <TabsList className="inline-flex w-max min-w-full">
        <TabsTrigger value="tab1" className="whitespace-nowrap">Tab One</TabsTrigger>
        <TabsTrigger value="tab2" className="whitespace-nowrap">Tab Two</TabsTrigger>
    </TabsList>
</div>
```

### Project Organization

1. **Component Structure**:

    - Reusable UI components go in `src/components/ui/`
    - Navigation components go in `src/components/navigation/`
    - Page-specific components should live within their page directory

2. **Server Logic**:

    - Keep all server-related code in the `src/server/` directory
    - Database models in `src/server/db/schema.ts`
    - API routes using tRPC procedures in `src/server/trpc/router.ts`

3. **Client Logic**:
    - Page components in `src/app/` using the App Router
    - Shared providers in `src/providers/`
    - Utility functions in `src/lib/`

## Development Workflow

### Environment Setup

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables in `.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/your_db
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Run development server:

```bash
pnpm dev
```

### Code Quality

The project enforces code quality standards with ESLint and Prettier:

- Pre-commit hooks (using Husky) ensure code formatting before commits
- Run `pnpm lint` to check for code quality issues
- Run `pnpm format` to automatically format code

### Database Management

- Modify schemas in `src/server/db/schema.ts`
- Generate migrations with `pnpm db:generate`
- Apply migrations with `pnpm db:push`

## Deployment Considerations

1. **Database Setup**:

    - Ensure your PostgreSQL database is properly set up
    - Run migrations on deployment with `pnpm db:push`

2. **Environment Variables**:

    - Set all required environment variables in your deployment platform
    - Ensure `NEXT_PUBLIC_APP_URL` is set to your production URL

3. **Build and Start**:
    - Build the application with `pnpm build`
    - Start the production server with `pnpm start`

## Extending the Project

### Adding New Authentication Providers

Better Auth supports multiple OAuth providers. Update the auth configuration in `src/server/auth/server.ts`:

```typescript
export const auth = betterAuth({
    // Existing config
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        // Perfect for educational institutions
        microsoft: {
            clientId: process.env.MICROSOFT_CLIENT_ID!,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
        },
    },
});
```

### Adding Two-Factor Authentication

For enhanced security in educational environments:

```typescript
import { twoFactor } from 'better-auth/plugins';

export const auth = betterAuth({
    // Existing config
    plugins: [
        nextCookies(),
        admin({
            defaultRole: 'user',
            impersonationSessionDuration: 60 * 60 * 24,
        }),
        twoFactor({
            issuer: 'ISTE Platform',
        }),
    ],
});
```

### Adding Organization Support

For multi-institutional support:

```typescript
import { organization } from 'better-auth/plugins';

export const auth = betterAuth({
    // Existing config
    plugins: [
        nextCookies(),
        admin({
            defaultRole: 'user',
            impersonationSessionDuration: 60 * 60 * 24,
        }),
        organization({
            allowUserToCreateOrganization: false, // Only admins can create institutions
            organizationLimit: 1, // Users can belong to one institution
        }),
    ],
});
```

### Implementing Role-Based Access Control

The application implements a **dual role system** for comprehensive access control and user management:

#### 1. Authentication Level Role (`users.role`)

This is the primary authorization mechanism provided by better-auth:

```typescript
// In auth-schema.ts
users: {
    role: text('role').notNull().default('user');
}
```

**Purpose**: Basic authentication and admin access control
**Values**: Simple strings like `'user'`, `'admin'`, `'moderator'`
**Used for**:

- Quick permission checks
- Better-auth admin plugin integration
- Basic route protection

```typescript
// Check user role in a protected route
const protectedRouter = router({
    adminRoute: publicProcedure.query(async () => {
        const session = await getUserSession();

        if (!session?.user || session.user.role !== 'admin') {
            throw new Error('Unauthorized: Admin access required');
        }

        // Admin-only logic
        return { status: 'Admin access granted' };
    }),
});
```

#### 2. Application Level Role (`roles` table + `user_profiles.roleId`)

This provides detailed role management for the application domain:

```typescript
// In schema.ts
export const roles = pgTable('roles', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    // ... other role metadata
});

export const userProfiles = pgTable('user_profiles', {
    // ... other fields
    roleId: integer('role_id').references(() => roles.id),
});
```

**Purpose**: Application-specific functionality and UI customization
**Values**: Database records like `{ id: 1, name: 'student', description: 'Undergraduate student' }`
**Used for**:

- Dynamic form fields based on role
- Role-specific dashboard features
- Custom application workflows
- Detailed user categorization

#### How They Work Together

```typescript
// Example: User with dual roles
const user = {
    // Auth-level role (for security)
    role: 'user',

    // Application-level role (for features)
    profile: {
        roleId: 2, // References roles table
        roleName: 'faculty'
    }
};

// Security check uses auth role
if (user.role !== 'admin') {
    throw new Error('Unauthorized');
}

// Feature logic uses application role
if (user.profile.roleName === 'faculty') {
    // Show faculty-specific dashboard
    return <FacultyDashboard />;
}
```

#### Benefits of This Architecture

1. **Separation of Concerns**: Security vs. application logic
2. **Scalability**: Easy to add new application roles without affecting auth
3. **Flexibility**: Application roles can have rich metadata
4. **Maintainability**: Changes to application roles don't affect security
5. **Better User Experience**: Detailed role-based customization

#### Example Implementation

```typescript
// tRPC procedure using both role systems
export const profileRouter = router({
    getProfile: publicProcedure.query(async ({ ctx }) => {
        const session = await getUserSession();

        // Security check (auth role)
        if (!session?.user) {
            throw new Error('Unauthorized');
        }

        // Get application role for customization
        const profile = await db.query.userProfiles.findFirst({
            where: eq(userProfiles.userId, session.user.id),
            with: {
                role: true, // Include role details
            },
        });

        // Customize response based on application role
        if (profile?.role.name === 'student') {
            return {
                ...profile,
                availableFields: getStudentFields(),
                dashboardType: 'student',
            };
        }

        return profile;
    }),
});
```

This dual role system provides the flexibility needed for educational platforms while maintaining strong security boundaries.

### Adding Background Jobs

For background job processing, consider adding a task queue like BullMQ:

1. Install the dependency:

```bash
pnpm add bullmq
```

2. Create a jobs directory:

```
src/server/jobs/
```

3. Implement job processing with Redis as the backend

### Date Handling and Hydration

To prevent hydration mismatches, the project includes a date utility library:

```typescript
// src/lib/date-utils.ts
import { formatDate, formatDeadline } from '@/lib/date-utils';

// Consistent date formatting
const formattedDate = formatDeadline('2024-12-31'); // "Dec 31, 2024"
```

#### Best Practices for Date Handling

1. **Always use the date utilities** for consistent formatting
2. **Avoid `toLocaleDateString()` without locale** to prevent hydration issues
3. **Use ISO date strings** for data storage and API communication
4. **Format dates on the client side** for display purposes

## Conclusion

This documentation provides a comprehensive overview of the rstart project structure, features, and best practices. The project combines modern technologies with an opinionated setup to provide a robust foundation for full-stack web application development.

The award creation system demonstrates advanced form handling, dynamic field generation, and proper hydration handling for a production-ready application.

For questions or improvements to this documentation, please contribute to the project repository.
