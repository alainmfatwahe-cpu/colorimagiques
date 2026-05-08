// backend/src/migrations/run.js
// Supporte SQLite, MySQL et PostgreSQL
import db from '../config/database.js';

async function hasColumn(table, column) {
  const client = db.client.config.client;
  if (client === 'pg' || client === 'mysql2') {
    const cols = await db.raw(`SELECT column_name FROM information_schema.columns WHERE table_name = ? AND column_name = ?`, [table, column]);
    return (client === 'pg' ? cols.rows : cols[0]).length > 0;
  } else {
    // SQLite
    const cols = await db.raw(`PRAGMA table_info('${table}')`);
    return cols.some(c => c.name === column);
  }
}

async function migrate() {
  console.log('🗄️  ColoriMagiques — Lancement des migrations...\n');
  const client = db.client.config.client;

  try {
    // ─── Table: admins ───
    const hasAdmins = await db.schema.hasTable('admins');
    if (!hasAdmins) {
      await db.schema.createTable('admins', (t) => {
        t.increments('id').primary();
        t.string('email', 255).notNullable().unique();
        t.string('password_hash', 255).notNullable();
        t.string('name', 255).notNullable();
        t.enum('role', ['superadmin', 'admin']).defaultTo('admin');
        t.timestamp('created_at').defaultTo(db.fn.now());
        t.timestamp('updated_at').defaultTo(db.fn.now());
      });
      console.log('  ✅ Table admins créée');
    } else {
      console.log('  ⏭️  Table admins existe déjà');
    }

    // ─── Table: products ───
    const hasProducts = await db.schema.hasTable('products');
    if (!hasProducts) {
      await db.schema.createTable('products', (t) => {
        t.increments('id').primary();
        t.string('slug', 255).notNullable().unique();
        t.string('title', 500).notNullable();
        t.string('title_en', 500).nullable();
        t.string('title_es', 500).nullable();
        t.string('title_de', 500).nullable();
        t.text('description').nullable();
        t.text('description_en').nullable();
        t.text('description_es').nullable();
        t.text('description_de').nullable();
        t.text('short_description').nullable();
        t.decimal('price_eur', 10, 2).notNullable();
        t.decimal('price_usd', 10, 2).notNullable();
        t.decimal('compare_price_eur', 10, 2).nullable();
        t.decimal('compare_price_usd', 10, 2).nullable();
        t.string('cover_image', 500).nullable();
        t.json('preview_images').nullable();
        t.string('pdf_filename', 500).nullable();
        t.string('bonus_filename', 500).nullable();
        t.integer('page_count').unsigned().defaultTo(0);
        t.integer('dpi').unsigned().defaultTo(300);
        t.enum('age_group', ['3-5', '6-8', '9-10']).notNullable();
        t.enum('theme', ['animals', 'space', 'dinosaurs', 'princesses', 'nature', 'vehicles', 'fantasy', 'ocean']).notNullable();
        t.string('badge', 50).defaultTo('');
        t.boolean('is_featured').defaultTo(false);
        t.boolean('is_published').defaultTo(true);
        t.decimal('average_rating', 3, 2).defaultTo(5.00);
        t.integer('review_count').unsigned().defaultTo(0);
        t.integer('download_count').unsigned().defaultTo(0);
        t.timestamp('created_at').defaultTo(db.fn.now());
        t.timestamp('updated_at').defaultTo(db.fn.now());
        t.index(['is_published', 'is_featured']);
        t.index(['theme']);
        t.index(['age_group']);
      });
      console.log('  ✅ Table products créée');
    } else {
      console.log('  ⏭️  Table products existe déjà');
    }

    // ─── Table: orders ───
    const hasOrders = await db.schema.hasTable('orders');
    if (!hasOrders) {
      await db.schema.createTable('orders', (t) => {
        t.increments('id').primary();
        t.string('order_number', 50).notNullable().unique();
        t.string('customer_email', 255).notNullable();
        t.string('customer_name', 255).notNullable();
        t.json('items').notNullable();
        t.decimal('total_amount', 10, 2).notNullable();
        t.string('currency', 10).defaultTo('EUR');
        t.string('status', 50).defaultTo('pending');
        t.string('payment_method', 50).nullable();
        t.string('stripe_session_id', 255).nullable();
        t.string('stripe_payment_intent', 255).nullable();
        t.json('download_links').nullable();
        t.string('promo_code', 50).nullable();
        t.decimal('discount_percent', 5, 2).defaultTo(0);
        t.string('language', 5).defaultTo('fr');
        t.timestamp('created_at').defaultTo(db.fn.now());
        t.timestamp('updated_at').defaultTo(db.fn.now());
        t.index(['customer_email']);
        t.index(['status']);
        t.index(['stripe_session_id']);
      });
      console.log('  ✅ Table orders créée');
    } else {
      console.log('  ⏭️  Table orders existe déjà');
    }

    // ─── Table: reviews ───
    const hasReviews = await db.schema.hasTable('reviews');
    if (!hasReviews) {
      await db.schema.createTable('reviews', (t) => {
        t.increments('id').primary();
        t.integer('product_id').unsigned().notNullable().references('id').inTable('products').onDelete('CASCADE');
        t.integer('order_id').unsigned().nullable().references('id').inTable('orders').onDelete('SET NULL');
        t.string('author_name', 255).notNullable();
        t.string('customer_email', 255).nullable();
        t.integer('rating').unsigned().notNullable();
        t.text('comment').nullable();
        t.string('language', 10).defaultTo('fr');
        t.boolean('verified_purchase').defaultTo(false);
        t.boolean('is_approved').defaultTo(false);
        t.timestamp('created_at').defaultTo(db.fn.now());
        t.index(['product_id', 'is_approved']);
        t.index(['order_id']);
      });
      console.log('  ✅ Table reviews créée');
    } else {
      console.log('  ⏭️  Table reviews existe déjà');
    }

    // ─── Table: download_tokens ───
    const hasTokens = await db.schema.hasTable('download_tokens');
    if (!hasTokens) {
      await db.schema.createTable('download_tokens', (t) => {
        t.increments('id').primary();
        t.string('token', 255).notNullable().unique();
        t.integer('order_id').unsigned().notNullable().references('id').inTable('orders').onDelete('CASCADE');
        t.integer('product_id').unsigned().notNullable().references('id').inTable('products').onDelete('CASCADE');
        t.string('filename', 500).notNullable();
        t.integer('download_count').unsigned().defaultTo(0);
        t.integer('max_downloads').unsigned().defaultTo(5);
        t.timestamp('expires_at').notNullable();
        t.timestamp('created_at').defaultTo(db.fn.now());
        t.index(['token']);
      });
      console.log('  ✅ Table download_tokens créée');
    } else {
      console.log('  ⏭️  Table download_tokens existe déjà');
    }

    // ─── Table: promo_codes ───
    const hasPromos = await db.schema.hasTable('promo_codes');
    if (!hasPromos) {
      await db.schema.createTable('promo_codes', (t) => {
        t.increments('id').primary();
        t.string('code', 50).notNullable().unique();
        t.decimal('discount_percent', 5, 2).notNullable();
        t.boolean('is_active').defaultTo(true);
        t.integer('max_uses').unsigned().nullable();
        t.integer('use_count').unsigned().defaultTo(0);
        t.timestamp('expires_at').nullable();
        t.timestamp('created_at').defaultTo(db.fn.now());
      });
      console.log('  ✅ Table promo_codes créée');
    } else {
      console.log('  ⏭️  Table promo_codes existe déjà');
    }

    // ─── Table: newsletter_subscribers ───
    const hasNewsletter = await db.schema.hasTable('newsletter_subscribers');
    if (!hasNewsletter) {
      await db.schema.createTable('newsletter_subscribers', (t) => {
        t.increments('id').primary();
        t.string('email', 255).notNullable().unique();
        t.string('language', 10).defaultTo('fr');
        t.boolean('is_active').defaultTo(true);
        t.timestamp('subscribed_at').defaultTo(db.fn.now());
        t.timestamp('unsubscribed_at').nullable();
        t.index(['email']);
        t.index(['is_active']);
      });
      console.log('  ✅ Table newsletter_subscribers créée');
    } else {
      console.log('  ⏭️  Table newsletter_subscribers existe déjà');
    }

    console.log('\n🎉 Migrations terminées !');
  } catch (err) {
    console.error('❌ Erreur migrations:', err.message);
    throw err;
  } finally {
    
  }
}

migrate();

export default migrate;