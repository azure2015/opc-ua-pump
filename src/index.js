const opcua = require('node-opcua');
const pump = require('./pump');

// Create an instance of OPCUAServer
const server = new opcua.OPCUAServer({
  port: 4840,
  nodeset_filename: [
    opcua.standard_nodeset_file,
    './src/pump/model/pump.xml',
  ],
});

// Set the buildInfo
server.buildInfo.productName = 'Pump Simulator';
server.buildInfo.buildNumber = '001';
server.buildInfo.buildDate = new Date(2018, 12, 26);


server.initialize(() => {
  const { addressSpace } = server.engine;

  // Add pumps to address space
  pump.add(addressSpace, 'Pump 1');
  pump.add(addressSpace, 'Pump 2');
  pump.add(addressSpace, 'Pump 3');
  pump.add(addressSpace, 'Pump 4');

  // Start the server
  server.start(() => {
    console.log('Server is now listening ... ( press CTRL+C to stop) ');

    server.endpoints[0].endpointDescriptions().forEach((endpoint) => {
      console.log(endpoint.endpointUrl,
        endpoint.securityMode.toString(),
        endpoint.securityPolicyUri.toString());
    });
  });
});
