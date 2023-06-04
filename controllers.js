const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const pool = require("./pool.js");

const packageDefinition = protoLoader.loadSync("./gate.proto", {
  keepCase: true,
  defaults: true,
  enums: String,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDefinition);

const api = grpcObject.api;

const server = new grpc.Server();

const log = (table, isvalid, idgate, idkartu) => {
  const query = `INSERT INTO ${table} (id_kartu_akses, id_register_gate, is_valid) VALUES ('${idkartu}', ${idgate}, ${isvalid})`;
  pool.request().query(query, (err, res) => {
    if (err) console.log("Error: " + err);
    console.log("log", res);
  });
};

server.addService(api.Posts.service, {
  keluar(call, callback) {
    const id_kartu_akses = call.request.id_kartu_akses;
    const id_register_gate = call.request.id_register_gate;
    console.log("(KELUAR) Melakukan Post dengan ID: " + id_kartu_akses + " dan " + id_register_gate);

    const query1 = `SELECT * FROM kartu_akses WHERE id_kartu_akses = '${id_kartu_akses}'`;
    const query2 = `SELECT * FROM register_gate WHERE id_register_gate = '${id_register_gate}'`;

    const request = pool.request();
    request.query(query1, (err, result) => {
      if (err) console.log(err);
      if (result.recordset.length === 0) {
        // If id kartu akses is invalid
        const response = { message: '0' };
        callback(null, response);
      } else if (result.recordset[0].is_aktif) {
        // If id kartu akses is valid and active
        log('log_keluar', 1, id_register_gate, id_kartu_akses);
        const response = { message: '1' };
        callback(null, response);
      } else {
        // If id kartu akses is valid but inactive
        log('log_keluar', 0, id_register_gate, id_kartu_akses);
        const response = { message: '0' };
        callback(null, response);
      }
    });
  },

  masuk(call, callback) {
    const id_kartu_akses = call.request.id_kartu_akses;
    const id_register_gate = call.request.id_register_gate;
    console.log("(MASUK) Melakukan Post dengan ID: " + id_kartu_akses + " dan " + id_register_gate);

    const query1 = `SELECT * FROM kartu_akses WHERE id_kartu_akses = '${id_kartu_akses}'`;
    const query2 = `SELECT * FROM register_gate WHERE id_register_gate = '${id_register_gate}'`;

    const request = pool.request();
    request.query(query1, (err, result) => {
      if (err) console.log(err);
      if (result.recordset.length === 0) {
        // If id kartu akses is invalid
        const response = { message: '0' };
        callback(null, response);
      } else if (result.recordset[0].is_aktif) {
        // If id kartu akses is valid and active
        request.query(query2, (err, result) => {
          if (err) console.log(err);
          if (result.recordset.length === 0) {
            // If id register gate is invalid
            log('log_masuk', 0, id_register_gate, id_kartu_akses);
            const response = { message: '0' };
            callback(null, response);
          } else {
            // If id register gate is valid
            log('log_masuk', 1, id_register_gate, id_kartu_akses);
            const response = { message: '1', id_kartu_akses: id_kartu_akses };
            callback(null, response);
          }
        });
      } else {
        // If id kartu akses is valid but inactive
        const response = { message: '0' };
        callback(null, response);
      }
    });
  },
});

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error("Failed to bind:", error);
    return;
  }
  console.log("Server started on port:", port);
  server.start();
});
