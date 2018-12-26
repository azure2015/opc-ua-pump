const opcua = require('node-opcua');

function update(pump) {
  const rpm = 35 + Math.floor(Math.random() * 5);

  // Set data values
  pump.rpm.setValueFromSource({
    dataType: opcua.DataType.Int16,
    value: rpm,
  });

  pump.status.setValueFromSource({
    dataType: opcua.DataType.UInt32,
    value: 0,
  });
}

module.exports = {
  add(addressSpace, name) {
    const index = addressSpace.getNamespaceIndex('http://yourorganisation.org/Pump/');
    const ns = addressSpace.getNamespace(index);

    // Create the pump and set any nonmutable vars
    const pumpType = ns.findObjectType('PumpType');
    const pump = pumpType.instantiate({
      browseName: name,
      organizedBy: 'ObjectsFolder',
    });
    pump.name.setValueFromSource({
      dataType: opcua.DataType.String,
      value: name,
    });

    setInterval(update, 1000, pump);
  },
};
