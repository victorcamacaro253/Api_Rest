import redis from '../db/redis.js';

async function getFromCache(key) {
    const cachedData = await redis.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
}

async function setToCache(key, value, ttl = 600) {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
}


const deleteFromCache = async (key) =>{
    try {
        await redis.del(key);
        console.log(`Cache eliminada para la clave: ${key}`);
    } catch (error) {
        console.error(`Error eliminando la cache para la clave ${key}:`, error.message);
        throw error; // Maneja el error según sea necesario.
    }
}

export default {getFromCache,setToCache,deleteFromCache}