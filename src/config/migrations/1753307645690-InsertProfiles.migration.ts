import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertProfiles1753307645690 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Insert profiles for each user
        await queryRunner.query(`
            INSERT INTO "profile" (bio, avatar) VALUES
            ('Software developer passionate about clean code and innovation', 'https://example.com/avatars/john.jpg'),
            ('UX designer creating beautiful user experiences', 'https://example.com/avatars/jane.jpg'),
            ('System administrator with 10+ years of experience', 'https://example.com/avatars/admin.jpg'),
            ('Data scientist exploring the world of AI and ML', 'https://example.com/avatars/alice.jpg'),
            ('DevOps engineer building scalable infrastructure', 'https://example.com/avatars/bob.jpg')
        `);

        // Get the profile IDs that were just inserted
        const profiles = await queryRunner.query(`SELECT id FROM "profile" ORDER BY id`);
        console.log('Inserted profiles:', profiles);

        // Update each user to link to their corresponding profile
        for (let i = 0; i < profiles.length; i++) {
            const userId = i + 1; // Users have IDs 1, 2, 3, 4, 5
            const profileId = profiles[i].id;
            
            await queryRunner.query(`
                UPDATE "user" SET "profileId" = $1 WHERE id = $2
            `, [profileId, userId]);
        }

        // Verify the relationships
        const usersWithProfiles = await queryRunner.query(`
            SELECT u.id, u.username, p.bio, p.avatar 
            FROM "user" u 
            LEFT JOIN "profile" p ON u."profileId" = p.id 
            ORDER BY u.id
        `);
        console.log('Users with profiles:', usersWithProfiles);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove profile links from users
        await queryRunner.query(`UPDATE "user" SET "profileId" = NULL WHERE "profileId" IS NOT NULL`);
        
        // Remove profiles
        await queryRunner.query(`DELETE FROM "profile"`);
    }

}
