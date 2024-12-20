import { pool } from "../../config/connection.database.js";

export const createUser = async (firstname, lastname, correo, telefono, supabase_user_id, direccion, departamento, profile) => {
    try {
        if (!firstname || !lastname || !correo || !telefono || !supabase_user_id || !direccion || !departamento) {
            throw new Error('Todos los campos son requeridos.');
        }


        const query = await pool.query(
            "SELECT * FROM registrar_usuario($1, $2, $3, $4, $5, $6, $7, $8)",
            [firstname, lastname, correo, telefono, supabase_user_id, direccion, departamento,profile]
        );

        const { rows } = query;

        if (rows.length === 0) {
            return { error: "No se pudo registrar el usuario." };
        }
  

        return rows[0];
    } catch (error) {
        return { error: `Error interno al crear usuario, ${error.message ?? ""}` };
    }
};



export const getUser = async (id_supabase) => {
  try {
    // Ejecuta la consulta para obtener los datos del usuario
    const response = await pool.query(
      "SELECT u.id, c.firstname, c.lastname, c.correo, c.telefono, c.created_at, c.updated_at, c.role,d.nombre, c.estado, u.direccion, u.profile_url FROM contacto c INNER JOIN usuario u ON c.id = u.id_contacto INNER JOIN departamento d ON d.id = c.departamento WHERE c.supabase_user_id = $1",
      [id_supabase]
    );
    
    const { rows } = response;

    // Si no se encuentra el usuario
    if (rows.length === 0) {
      return { error: "Usuario no encontrado." };
    }

    // Retorna el primer usuario encontrado (ya que debería ser único)
    return rows[0];
  } catch (error) {
    return { error: "Error interno al obtener el usuario." };
  }
};
