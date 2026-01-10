import { JSONFilePreset } from 'lowdb/node';

const defaultData = { postulantes: [] };

export const db = await JSONFilePreset('db.json', defaultData);