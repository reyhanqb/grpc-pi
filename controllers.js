const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const pool = require("./pool.js")

const packageDefinition = protoLoader.loadSync("./gate.proto", {
  keepCase: true,
  defaults: true,
  enums: String,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDefinition)

const api = grpcObject.api

const server = new grpc.Server()

const login = (table, isvalid, idgate, idkartu) => {
  let query = `INSERT INTO ${table} (id_kartu_akses, id_register_gate, is_valid) VALUES (${idkartu}, ${idgate}, ${isvalid})`;
  pool.request().query(query, (err, res) => {
    if (err) throw err;

    console.log(res);
  });
};



server.addService(api.Posts.service, {
  keluar(call, callback) {
  const id_kartu_akses = call.request.id_kartu_akses;
  console.log("(KELUAR) Melakukan Post  dengan ID: " + id_kartu_akses);

  // Your logic for handling the keluar request

  const response = { message: "Your response message" };
  callback(null, response);
},
  masuk(call, callback) {
  const id_kartu_akses = call.request.id_kartu_akses;
  const id_register_gate = call.request.id_register_gate;
  console.log(
    "(MASUK) Melakukan Post dengan ID: " +
      id_kartu_akses +
      " dan " +
      id_register_gate
  );

  // Your logic for handling the masuk request

  const response = { message: "Your response message" };
  callback(null, response);
}
})





function keluar(call, callback) {
  const id_kartu_akses = call.request.id_kartu_akses;
  console.log("(KELUAR) Melakukan Post  dengan ID: " + id_kartu_akses);

  // Your logic for handling the keluar request

  const response = { message: "Your response message" };
  callback(null, response);
}

function masuk(call, callback) {
  const id_kartu_akses = call.request.id_kartu_akses;
  const id_register_gate = call.request.id_register_gate;
  console.log(
    "(MASUK) Melakukan Post dengan ID: " +
      id_kartu_akses +
      " dan " +
      id_register_gate
  );

  // Your logic for handling the masuk request

  const response = { message: "Your response message" };
  callback(null, response);
}

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error("Failed to bind:", error);
      return;
    }
    console.log("Server started on port:", port);
    server.start();
  }
);
