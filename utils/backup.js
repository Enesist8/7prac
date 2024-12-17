const { exec } = require("child_process");
const path = require("path");
const { promisify } = require("util");
const { Pool } = require("pg");
const fs = require("fs").promises;

const execAsync = promisify(exec);
const backupDatabase = async (config, backupFolder) => {
  const { user, host, database, password, port } = config;
  console.log("Backup process starting");
  console.log("Config", { user, host, database, password, port });
  console.log(`Backup process using pg_dump: ${config.usePgDump}`);
  const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
  const backupFile = path.join(backupFolder, `backup_${timestamp}.sql`);
  let client;
  try {
    if (config.usePgDump) {
      const command = `pg_dump -U ${user} -h ${host} -p ${port} -d ${database} -f ${backupFile} -W`;
      console.log("Executing command:", command);
      await execAsync(command, {});
      console.log("Backup command executed successfully");

      return backupFile;
    } else {
      const pool = new Pool({
        user,
        host,
        database,
        password,
        port,
      });
      try {
        client = await pool.connect();
        console.log("Using node client tools");
        const tables = await getTableNames(client);
        let sqlStatements = "";
        for (const table of tables) {
          const data = await getTableData(client, table);
          sqlStatements += dataToSQL(table, data);
        }
        await fs.writeFile(backupFile, sqlStatements, "utf-8");
        console.log("Backup using node client tools completed successfully");
        return backupFile;
      } catch (e) {
        console.error("Error while running backup with client tools", e);
        throw e;
      } finally {
        if (client) client.release();
        await pool.end();
      }
    }
  } catch (error) {
    console.error("Error during database backup:", error);
    console.error("Error message:", error.message);
    throw new Error("Failed to create database backup.");
  }
};

const getTableNames = async (client) => {
  const res = await client.query(
    "SELECT tablename FROM pg_tables WHERE schemaname='public';",
  );
  return res.rows.map((row) => row.tablename);
};

const getTableData = async (client, table) => {
  const res = await client.query(`SELECT * FROM "${table}"`);
  return res.rows;
};

const dataToSQL = (tableName, data) => {
  if (!data || data.length === 0) return "";
  let sql = "";
  for (const row of data) {
    const columns = Object.keys(row);
    const values = Object.values(row).map((val) => {
      if (val === null) {
        return "NULL";
      } else if (typeof val === "string") {
        return `'${val.replace(/'/g, "''")}'`;
      } else if (typeof val === "boolean") {
        return val;
      } else if (val instanceof Date) {
        return `'${val.toISOString()}'`;
      }
      return val;
    });
    sql += `INSERT INTO "${tableName}" (${columns.map((col) => `"${col}"`).join(", ")}) VALUES (${values.join(", ")});\n`;
  }
  return sql;
};

module.exports = { backupDatabase };
