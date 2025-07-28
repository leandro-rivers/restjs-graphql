import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertTestData1753305205584 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, let's check if users already exist
        const existingUsers = await queryRunner.query(`SELECT id FROM "user" LIMIT 5`);
        console.log('Existing users:', existingUsers);

        // Insert Users with explicit IDs to ensure they get the expected IDs
        await queryRunner.query(`
            INSERT INTO "user" (id, username, email, role, password) VALUES
            (1, 'john_doe', 'john@example.com', 'USER', 'hashed_password_1'),
            (2, 'jane_smith', 'jane@example.com', 'USER', 'hashed_password_2'),
            (3, 'admin_user', 'admin@example.com', 'ADMIN', 'hashed_password_3'),
            (4, 'alice_wong', 'alice@example.com', 'USER', 'hashed_password_4'),
            (5, 'bob_johnson', 'bob@example.com', 'USER', 'hashed_password_5')
        `);

        // Verify users were inserted
        const usersAfterInsert = await queryRunner.query(`SELECT id, username FROM "user" ORDER BY id`);
        console.log('Users after insert:', usersAfterInsert);

        // Insert Tags
        await queryRunner.query(`
            INSERT INTO "tag" (name) VALUES
            ('JavaScript'),
            ('TypeScript'),
            ('NestJS'),
            ('GraphQL'),
            ('PostgreSQL'),
            ('Docker'),
            ('React'),
            ('Node.js'),
            ('Testing'),
            ('API')
        `);

        // Get the actual tag IDs
        const tags = await queryRunner.query(`SELECT id, name FROM "tag" ORDER BY id`);
        console.log('Tags after insert:', tags);

        // Insert Posts for each user (5 posts per user = 25 total posts)
        await queryRunner.query(`
            INSERT INTO "post" (title, content, "userId") VALUES
            -- John's posts
            ('Getting Started with NestJS', 'NestJS is a progressive Node.js framework for building efficient, reliable and scalable server-side applications.', 1),
            ('TypeScript Best Practices', 'TypeScript adds static typing to JavaScript, making your code more robust and maintainable.', 1),
            ('GraphQL vs REST API', 'Understanding the differences between GraphQL and REST APIs and when to use each.', 1),
            ('Database Design Patterns', 'Common database design patterns and when to apply them in your projects.', 1),
            ('Microservices Architecture', 'Building scalable applications using microservices architecture principles.', 1),
            
            -- Jane's posts
            ('UI/UX Design Principles', 'Essential design principles for creating user-friendly interfaces.', 2),
            ('Responsive Web Design', 'Creating websites that work perfectly on all devices and screen sizes.', 2),
            ('Color Theory in Design', 'Understanding color psychology and its impact on user experience.', 2),
            ('Typography Best Practices', 'Choosing the right fonts and typography for your designs.', 2),
            ('Design Systems', 'Building consistent design systems for large-scale applications.', 2),
            
            -- Admin's posts
            ('System Security Best Practices', 'Essential security measures for protecting your applications and data.', 3),
            ('Server Monitoring and Logging', 'Setting up comprehensive monitoring and logging for production systems.', 3),
            ('Backup and Recovery Strategies', 'Implementing robust backup and disaster recovery solutions.', 3),
            ('Performance Optimization', 'Techniques for optimizing application and database performance.', 3),
            ('Infrastructure as Code', 'Managing infrastructure using code and automation tools.', 3),
            
            -- Alice's posts
            ('Introduction to Machine Learning', 'Getting started with machine learning algorithms and concepts.', 4),
            ('Data Visualization Techniques', 'Creating compelling visualizations to communicate data insights.', 4),
            ('Big Data Processing', 'Handling large datasets efficiently using modern tools and techniques.', 4),
            ('AI Ethics and Bias', 'Understanding the ethical implications of artificial intelligence.', 4),
            ('Deep Learning Fundamentals', 'Exploring neural networks and deep learning architectures.', 4),
            
            -- Bob's posts
            ('Docker Containerization', 'Containerizing applications with Docker for consistent deployments.', 5),
            ('Kubernetes Orchestration', 'Managing containerized applications at scale with Kubernetes.', 5),
            ('CI/CD Pipeline Setup', 'Setting up continuous integration and deployment pipelines.', 5),
            ('Cloud Infrastructure', 'Deploying and managing applications on cloud platforms.', 5),
            ('DevOps Culture', 'Building a collaborative culture between development and operations teams.', 5)
        `);

        // Get the actual post IDs
        const posts = await queryRunner.query(`SELECT id, title FROM "post" ORDER BY id`);
        console.log('Posts after insert:', posts);

        // Create a mapping of tag names to IDs
        const tagMap = tags.reduce((acc, tag) => {
            acc[tag.name] = tag.id;
            return acc;
        }, {});

        // Insert Post-Tag relationships using actual IDs
        const postTagRelationships = [
            // John's posts (posts 1-5)
            [posts[0].id, tagMap['NestJS']], [posts[0].id, tagMap['Node.js']],
            [posts[1].id, tagMap['TypeScript']], [posts[1].id, tagMap['Testing']],
            [posts[2].id, tagMap['GraphQL']], [posts[2].id, tagMap['API']],
            [posts[3].id, tagMap['PostgreSQL']], [posts[3].id, tagMap['Testing']],
            [posts[4].id, tagMap['Docker']], [posts[4].id, tagMap['Node.js']],
            
            // Jane's posts (posts 6-10)
            [posts[5].id, tagMap['React']], [posts[5].id, tagMap['Testing']],
            [posts[6].id, tagMap['React']], [posts[6].id, tagMap['TypeScript']],
            [posts[7].id, tagMap['React']], [posts[7].id, tagMap['Testing']],
            [posts[8].id, tagMap['TypeScript']], [posts[8].id, tagMap['React']],
            [posts[9].id, tagMap['React']], [posts[9].id, tagMap['TypeScript']],
            
            // Admin's posts (posts 11-15)
            [posts[10].id, tagMap['Node.js']], [posts[10].id, tagMap['Testing']],
            [posts[11].id, tagMap['Node.js']], [posts[11].id, tagMap['PostgreSQL']],
            [posts[12].id, tagMap['PostgreSQL']], [posts[12].id, tagMap['Docker']],
            [posts[13].id, tagMap['Node.js']], [posts[13].id, tagMap['Testing']],
            [posts[14].id, tagMap['Docker']], [posts[14].id, tagMap['Node.js']],
            
            // Alice's posts (posts 16-20)
            [posts[15].id, tagMap['TypeScript']], [posts[15].id, tagMap['Node.js']],
            [posts[16].id, tagMap['React']], [posts[16].id, tagMap['TypeScript']],
            [posts[17].id, tagMap['PostgreSQL']], [posts[17].id, tagMap['Node.js']],
            [posts[18].id, tagMap['TypeScript']], [posts[18].id, tagMap['Testing']],
            [posts[19].id, tagMap['Node.js']], [posts[19].id, tagMap['PostgreSQL']],
            
            // Bob's posts (posts 21-25)
            [posts[20].id, tagMap['Docker']], [posts[20].id, tagMap['Node.js']],
            [posts[21].id, tagMap['Docker']], [posts[21].id, tagMap['Node.js']],
            [posts[22].id, tagMap['Docker']], [posts[22].id, tagMap['Testing']],
            [posts[23].id, tagMap['Docker']], [posts[23].id, tagMap['Node.js']],
            [posts[24].id, tagMap['Docker']], [posts[24].id, tagMap['Node.js']]
        ];

        // Insert the relationships
        for (const [postId, tagId] of postTagRelationships) {
            await queryRunner.query(`
                INSERT INTO "post_tags_tag" ("postId", "tagId") VALUES ($1, $2)
            `, [postId, tagId]);
        }

        // Update the sequence for the user table to start from the next available ID
        await queryRunner.query(`SELECT setval('user_id_seq', (SELECT MAX(id) FROM "user"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove Post-Tag relationships
        await queryRunner.query(`DELETE FROM "post_tags_tag"`);
        
        // Remove Posts
        await queryRunner.query(`DELETE FROM "post"`);
        
        // Remove Tags
        await queryRunner.query(`DELETE FROM "tag"`);
        
        // Remove Users (profiles will be deleted automatically due to cascade)
        await queryRunner.query(`DELETE FROM "user" WHERE id IN (1, 2, 3, 4, 5)`);
    }

}
