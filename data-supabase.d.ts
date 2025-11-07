// Type declarations for data-supabase.js

export interface User {
  id: number;
  email: string;
  name?: string;
  uuid: string;
  resume_path?: string;
  created_at: string;
}

export interface Team {
  id: number;
  name: string;
  password_hash: string;
  created_at: string;
}

export interface TeamMembership {
  team_id: number;
  name: string;
  created_at: string;
  joined_at: string;
}

export interface HardwareItem {
  id: number;
  name: string;
  description: string;
  cost: number;
  stock: number;
  image_url?: string;
  category: string;
  compatibility?: string;
}

export interface Purchase {
  id: number;
  team_id: number;
  item_id: number;
  name: string;
  description?: string;
  quantity: number;
  total_cost: number;
  purchased_at: string;
  fulfilled?: boolean;
  fulfilled_at?: string | null;
}

export interface Order {
  id: number;
  team_id: number;
  team_name: string;
  item_id: number;
  item_name: string;
  item_description: string;
  quantity: number;
  total_cost: number;
  purchased_at: string;
  fulfilled: boolean;
  fulfilled_at: string | null;
}

export interface Budget {
  maxBudget: number;
  totalSpent: number;
  remaining: number;
  memberCount: number;
}

export interface Stats {
  totalUsers: number;
  totalSaves: number;
  usersWithProfiles?: number;
  recentUsers?: number;
  recentSaves?: number;
}

// User functions
export function getUserByEmail(email: string): Promise<User | null>;
export function getUserById(id: number): Promise<User | null>;
export function getUserByUuid(uuid: string): Promise<User | null>;
export function createUser(data: { email: string; name?: string }): Promise<User>;
export function updateUserProfile(userId: number, name?: string, resume_path?: string): Promise<void>;

// Save functions
export function addSave(viewer_user_id: number, viewed_user_id: number): Promise<void>;
export function getSavesForViewer(viewer_user_id: number): Promise<any[]>;

// Admin functions
export function getAllUsers(limit?: number): Promise<User[]>;
export function getAllSaves(limit?: number): Promise<any[]>;
export function getUserStats(): Promise<Stats>;

// Team functions
export function createTeam(data: { name: string; password_hash: string }): Promise<Team>;
export function getTeamByName(name: string): Promise<Team | null>;
export function verifyTeamPassword(teamId: number, password: string): Promise<boolean>;
export function addTeamMember(team_id: number, user_id: number): Promise<any>;
export function removeTeamMember(user_id: number): Promise<any>;
export function getUserTeam(user_id: number): Promise<TeamMembership | null>;
export function getTeamMembers(team_id: number): Promise<User[]>;
export function getTeamBudget(team_id: number): Promise<Budget>;

// Hardware functions
export function getHardwareItems(): Promise<HardwareItem[]>;
export function purchaseHardware(team_id: number, item_id: number, quantity: number): Promise<any>;
export function getTeamPurchases(team_id: number): Promise<Purchase[]>;

// Admin - Orders functions
export function getAllOrders(): Promise<Order[]>;
export function markOrderFulfilled(purchaseId: number, fulfilled?: boolean): Promise<void>;
export function markMultipleOrdersFulfilled(purchaseIds: number[], fulfilled?: boolean): Promise<void>;
export function undoPurchase(purchaseId: number): Promise<{ success: boolean; restored_quantity: number }>;

