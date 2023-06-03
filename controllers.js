const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const pool = require("./database/pool.js")

const packageDefinition = protoLoader.loadSync("gate.proto");
const gate = grpc.loadPackageDefinition(packageDefinition).gate;

const server = new grpc.Server();

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

server.addService(gate.posts.service, { keluar, masuk });

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
