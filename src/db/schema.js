import {
    pgTable,
    serial,
    text,
    timestamp,
    integer,
    pgEnum,
    jsonb,
    varchar,
} from "drizzle-orm/pg-core";

/**
 * ENUM: match_status
 * Values: scheduled | live | finished
 */
export const matchStatusEnum = pgEnum("match_status", [
    "scheduled",
    "live",
    "finished",
]);

/**
 * TABLE: matches
 */
export const matches = pgTable("matches", {
    id: serial("id").primaryKey(),
    sport: varchar("sport", { length: 50 }).notNull(),
    homeTeam: varchar("home_team", { length: 100 }).notNull(),
    awayTeam: varchar("away_team", { length: 100 }).notNull(),
    status: matchStatusEnum("status").default("scheduled").notNull(),
    startTime: timestamp("start_time", { withTimezone: true }),
    endTime: timestamp("end_time", { withTimezone: true }),
    homeScore: integer("home_score").default(0).notNull(),
    awayScore: integer("away_score").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

/**
 * TABLE: commentary
 */
export const commentary = pgTable("commentary", {
    id: serial("id").primaryKey(),
    matchId: integer("match_id")
        .notNull()
        .references(() => matches.id, { onDelete: "cascade" }),
    minute: integer("minute"),
    sequence: integer("sequence").notNull(), // ordering within same minute
    period: varchar("period", { length: 50 }), // e.g., 1st Half, Q1, OT
    eventType: varchar("event_type", { length: 50 }), // goal, foul, timeout, etc.
    actor: varchar("actor", { length: 100 }), // player name
    team: varchar("team", { length: 100 }), // home or away or team name
    message: text("message").notNull(),
    metadata: jsonb("metadata"), // flexible structured event data
    tags: text("tags").array(), // searchable tags
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

