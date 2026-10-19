export type Character = {
  character_id: number;
  name: string;
  franchise: string;
  image_url: string;
};

export type Turn = {
  event: string;
  attacker?: string;
  defender?: string;
  damage_dealt?: number;
  missed?: boolean;
  defender_health?: number;
  winner?: string | null;
  narration?: string | null;
  message?: string;
  fighter1?: string;
  fighter1_max_health?: number;
  fighter2?: string;
  fighter2_max_health?: number;
};

export type Side = "fighter1" | "fighter2";

export type Health = Record<Side, number>;

// A new Hit object is created for every landed attack, which is what triggers the clash animation
export type Hit = { defender: Side };
