import 'dotenv/config';
import { db } from './index';
import { roles } from './schema';

export async function seedDatabase() {
    try {
        const defaultRoles = [
            { name: 'student', description: 'Student users' },
            { name: 'faculty', description: 'Faculty and teachers' },
            { name: 'admin', description: 'Administrators' },
            { name: 'institution', description: 'Educational institutions' },
        ];

        for (const role of defaultRoles) {
            await db.insert(roles).values(role).onConflictDoNothing();
        }
    } catch (error) {
        console.error('Database seeding failed:', error);
        throw error;
    }
}

if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log('Seeding completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Seeding failed:', error);
            process.exit(1);
        });
}
