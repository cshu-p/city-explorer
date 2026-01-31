import { City } from "../models/city"
import { pokemonData, pokemonSpawnData} from "../../../data/mockData";
import { pool } from "../db";
import { User } from "../models/user";
import { RegisterRequest } from "../routes/registerRoutes";


export async function getCityByID(cityID: number): Promise<City | undefined> {
    const result = await pool.query<City>(
      `
      SELECT
        regionid         AS "regionID",
        sizerank         AS "sizeRank",
        regionname       AS "regionName",
        regiontype       AS "regionType",
        state,
        metro,
        countyname AS "countyName",
        rent
      FROM city_rent
      WHERE regionid = $1;
      `,
      [cityID]
    );
  
    return result.rows[0];
}

export type DbUser = {
    id: number;
    username: string;
    password_hash: string;
};

export async function findUserByUsername(username: string): Promise<DbUser | undefined> {
    const result = await pool.query<DbUser>(
        `SELECT id, username, password_hash FROM user_table WHERE username = $1`,
        [username]
    );
    return result.rows[0];
}

export async function addUser(user: RegisterRequest, password_hash: string): Promise<number> {
    const { rows } = await pool.query<{ id: number }>(
        `INSERT INTO user_table (username, password, password_hash, email, first_name, last_name)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`,
        [user.username, user.password, password_hash, user.email, user.firstName, user.lastName]
    );
    return rows[0].id;
}

export async function findCityByRegionName(regionName: string): Promise<City | null> {
    const result = await pool.query<City>(
        `SELECT * FROM city_rent WHERE regionname = $1`,
        [regionName]
    );
    return result.rows[0] ?? null;
}
