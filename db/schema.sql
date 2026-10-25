-- ============================================================================
-- HUMAN: Activity-First Social Network (Jaipur Launch Architecture)
-- Database: PostgreSQL 15+ with PostGIS Extension
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ----------------------------------------------------------------------------
-- 1. USERS & AUTHENTICATION
-- ----------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('user', 'host', 'community_lead', 'moderator', 'admin');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone_verified BOOLEAN DEFAULT FALSE,
    role user_role DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. PROFILES & DISCOVERABILITY
-- ----------------------------------------------------------------------------
CREATE TYPE privacy_scope AS ENUM ('public', 'community', 'friends', 'private');

CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    city VARCHAR(100) DEFAULT 'Jaipur',
    neighborhood VARCHAR(100) NOT NULL, -- e.g. C-Scheme, Malviya Nagar, Raja Park, Vaishali Nagar, Pink City
    approx_location GEOMETRY(Point, 4326), -- Approximate coordinate center of neighborhood
    discovery_radius_km INTEGER DEFAULT 5,
    is_discoverable BOOLEAN DEFAULT TRUE,
    looking_for TEXT[] DEFAULT ARRAY[]::TEXT[],
    social_links JSONB DEFAULT '{}',
    verification_status verification_status DEFAULT 'unverified',
    attendance_rate NUMERIC(5,2) DEFAULT 100.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_neighborhood ON profiles(neighborhood);
CREATE INDEX idx_profiles_location ON profiles USING GIST(approx_location);

-- ----------------------------------------------------------------------------
-- 3. INTERESTS & USER INTERESTS
-- ----------------------------------------------------------------------------
CREATE TABLE interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL, -- Creative, Sports, Food, Learning, Tech, etc.
    icon_name VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_interests (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    interest_id UUID REFERENCES interests(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(50) DEFAULT 'enthusiast', -- beginner, enthusiast, pro
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, interest_id)
);

-- ----------------------------------------------------------------------------
-- 4. PLACES & JAIPUR VENUES (Public cafes, co-working, grounds)
-- ----------------------------------------------------------------------------
CREATE TABLE places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    place_type VARCHAR(100), -- cafe, co-working, public ground, heritage site, studio
    is_verified BOOLEAN DEFAULT TRUE,
    cover_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_places_location ON places USING GIST(location);

-- ----------------------------------------------------------------------------
-- 5. COMMUNITIES & MEMBERSHIP
-- ----------------------------------------------------------------------------
CREATE TYPE community_type AS ENUM ('neighborhood', 'hobby', 'creator', 'sports', 'learning', 'cultural');

CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    community_type community_type NOT NULL,
    neighborhood VARCHAR(100), -- Nullable if city-wide
    cover_image TEXT,
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    member_count INTEGER DEFAULT 1,
    is_verified BOOLEAN DEFAULT FALSE,
    rules TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_communities_neighborhood ON communities(neighborhood);

CREATE TABLE community_members (
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- member, moderator, organizer
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (community_id, user_id)
);

-- ----------------------------------------------------------------------------
-- 6. ACTIVITIES & EVENTS (Core Loop)
-- ----------------------------------------------------------------------------
CREATE TYPE activity_status AS ENUM ('published', 'in_progress', 'completed', 'cancelled');
CREATE TYPE intent_type AS ENUM ('talk', 'connect', 'create', 'experience', 'grow', 'belong', 'play', 'surprise');

CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID REFERENCES users(id) ON DELETE CASCADE,
    community_id UUID REFERENCES communities(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    intent intent_type NOT NULL,
    category VARCHAR(100) NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    place_id UUID REFERENCES places(id) ON DELETE SET NULL,
    venue_name VARCHAR(255) NOT NULL,
    meeting_point_details TEXT, -- e.g. "Outside Tapri Central main entrance near fountain"
    approx_location GEOMETRY(Point, 4326) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 90,
    max_participants INTEGER NOT NULL CHECK (max_participants >= 2),
    current_participants INTEGER DEFAULT 1,
    price_inr NUMERIC(10,2) DEFAULT 0.00,
    is_paid BOOLEAN DEFAULT FALSE,
    experience_level VARCHAR(50) DEFAULT 'All levels',
    what_to_bring TEXT[] DEFAULT ARRAY[]::TEXT[],
    safety_guidelines TEXT,
    cover_image TEXT,
    status activity_status DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activities_time ON activities(start_time);
CREATE INDEX idx_activities_location ON activities USING GIST(approx_location);
CREATE INDEX idx_activities_neighborhood ON activities(neighborhood);
CREATE INDEX idx_activities_intent ON activities(intent);

-- ----------------------------------------------------------------------------
-- 7. PARTICIPATION & PROOF OF PRESENCE (Attendance)
-- ----------------------------------------------------------------------------
CREATE TYPE participation_status AS ENUM ('joined', 'cancelled', 'waitlisted');

CREATE TABLE activity_participants (
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status participation_status DEFAULT 'joined',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (activity_id, user_id)
);

CREATE TABLE activity_attendance (
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    confirmed_presence BOOLEAN DEFAULT FALSE,
    confirmed_by_peer BOOLEAN DEFAULT FALSE,
    host_confirmed BOOLEAN DEFAULT FALSE,
    confirmed_at TIMESTAMPTZ,
    notes TEXT,
    PRIMARY KEY (activity_id, user_id)
);

-- ----------------------------------------------------------------------------
-- 8. CONNECTIONS & SOCIAL GRAPH
-- ----------------------------------------------------------------------------
CREATE TYPE connection_status AS ENUM ('pending', 'connected', 'ignored', 'blocked');

CREATE TABLE connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status connection_status DEFAULT 'pending',
    origin_activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
    icebreaker_text TEXT,
    connected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_connection_pair UNIQUE(requester_id, receiver_id)
);

-- ----------------------------------------------------------------------------
-- 9. MESSAGING & REAL-TIME COORDINATION
-- ----------------------------------------------------------------------------
CREATE TYPE conversation_type AS ENUM ('direct', 'activity_coordination', 'community_channel');

CREATE TABLE conversation_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_type conversation_type NOT NULL,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES conversation_threads(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachment_url TEXT,
    attachment_type VARCHAR(50),
    is_announcement BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_thread_time ON messages(thread_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- 10. MEMORY SYSTEM (Experience Graph Artifacts)
-- ----------------------------------------------------------------------------
CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    story TEXT,
    voice_note_url TEXT,
    photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    neighborhood VARCHAR(100) NOT NULL,
    privacy privacy_scope DEFAULT 'private',
    experience_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE memory_participants (
    memory_id UUID REFERENCES memories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    consent_given BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (memory_id, user_id)
);

-- ----------------------------------------------------------------------------
-- 11. TRUST, SAFETY, REPORTS & MODERATION
-- ----------------------------------------------------------------------------
CREATE TYPE report_reason AS ENUM (
    'harassment', 'spam', 'fake_identity', 'unsafe_behavior',
    'fraud', 'inappropriate_content', 'other'
);
CREATE TYPE report_status AS ENUM ('pending', 'under_review', 'resolved', 'dismissed');

CREATE TABLE safety_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reported_activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
    reported_community_id UUID REFERENCES communities(id) ON DELETE SET NULL,
    reason report_reason NOT NULL,
    details TEXT NOT NULL,
    status report_status DEFAULT 'pending',
    admin_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE blocked_users (
    blocker_id UUID REFERENCES users(id) ON DELETE CASCADE,
    blocked_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (blocker_id, blocked_id)
);

CREATE TABLE verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    id_document_type VARCHAR(100) NOT NULL,
    status verification_status DEFAULT 'pending',
    reviewer_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 12. PAYMENTS (UPI-First Architecture)
-- ----------------------------------------------------------------------------
CREATE TYPE payment_status AS ENUM ('initiated', 'completed', 'failed', 'refunded');

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
    amount_inr NUMERIC(10,2) NOT NULL,
    gateway_reference VARCHAR(255),
    upi_transaction_id VARCHAR(255),
    status payment_status DEFAULT 'initiated',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- ----------------------------------------------------------------------------
-- 13. SAVED ITEMS & NOTIFICATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE saved_items (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL, -- activity, community, person, place
    item_id UUID NOT NULL,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, item_type, item_id)
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- activity, connection, message, memory, safety
    reference_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
