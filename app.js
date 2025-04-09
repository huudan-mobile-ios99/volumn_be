var express = require('express')
var morgan = require('morgan');
var app = express();
var path = require('path')
const mongoose = require('mongoose');
var cors = require('cors');
var router = express.Router();
var crypto = require('crypto')
app.use(express.json());
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use(express.urlencoded({ extended: true }));
const logStream = fs.createWriteStream('log.txt', { flags: 'a' });
app.use(morgan('tiny'));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var axios = require('axios');
app.use(morgan(':method :url :status :response-time ms - :res[content-length]', { stream: logStream }));
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204
}));
const Excel = require('exceljs');

//use with change proxy
app.use('/', router);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var port = process.env.PORT || 8097;
app.listen(port);
console.log('app running at port vegas volumn control: ' + port);

//connect mongoDB
var config = require('./config')
config.connectDB()



// app.get('/', function (req, res) {
//   res.end('index page - volume control');
// })
//run the web
app.use(express.static('public-flutter'));
app.use(express.static('public-flutter/assets'));
router.get('/', (request, response) => {
    response.sendFile(path.resolve('./public-flutter/index.html'));
})


const volumeModel = require('./model/volume');
const presetsModel = require('./model/preset');
app.post('/create_volume', async (req, res) => {
  try {
    const { id, name, deviceName } = req.body;

    // Check if there is a volume with the same id, name, and deviceName
    const existingVolume = await volumeModel.findOne({ id, name, deviceName });
    if (existingVolume) {
      return res.status(400).send({ "status": false, "message": "A volume with the same id, name, and deviceName already exists", "data": null });
    }

    const volume = new volumeModel(req.body);
    await volume.save();
    res.status(201).send(volume);
  } catch (err) {
    res.status(500).send({ "status": false, "message": "Internal server error", "data": null });
  }
});

// Route to list all records
app.get('/list_volume', async (req, res) => {
  try {
    // const { type } = req.query;
    // let query = { type: { $in: [0] } }; // Default query for type = 0
    // if (type === '0' || type === '2') {
    //   query = { type: parseInt(type) }; // Modify query if type is 1 or 2
    // }

    // const volumes = await volumeModel.find(query).sort({ id: 1 }).lean();
    const volumes = await volumeModel.find({ type: { $in: [0, 2] } }).sort({ id: 1 }).lean();
    // const volumes = await volumeModel.find({ type: 0 }).sort({ id: 1 }).lean(); // Sorting by id in ascending order (ASC)
    volumes.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    if (!volumes || volumes.length === 0) {
      res.status(404).send({ "status": false, "message": `no volumes found `, "data": null });
    } else {
      res.status(200).send({ "status": true, "message": `volumes found ${volumes.length}`, "data": volumes });
    }
  } catch (err) {
    res.status(500).send({ "status": false, "message": "fail to retrieve volumes", "data": null });
  }
});
// Route to list all records
app.get('/list_volume_all', async (req, res) => {
  try {
    const volumes = await volumeModel.find().sort({ id: 1 }).lean(); // Sorting by id in ascending order (ASC)

    // Separate volumes into two arrays based on their type
    const type0Volumes = volumes.filter(volume => volume.type === 0);
    const type1Volumes = volumes.filter(volume => volume.type === 1);

    // Concatenate the arrays, placing type 0 volumes first
    const sortedVolumes = type0Volumes.concat(type1Volumes);

    if (!sortedVolumes || sortedVolumes.length === 0) {
      res.status(404).send({ "status": false, "message": `no volumes found `, "data": null });
    } else {
      res.status(200).send({ "status": true, "message": `volumes found ${sortedVolumes.length}`, "data": sortedVolumes });
    }
  } catch (err) {
    res.status(500).send({ "status": false, "message": "fail to retrieve volumes", "data": null });
  }
});

// Route to delete a volume by ID
app.delete('/delete_volume/:id', async (req, res) => {
  try {
    const volume = await volumeModel.findByIdAndDelete(req.params.id);
    if (!volume) {
      res.status(404).send({ "status": false, "message": "volume not found", "data": null });
    } else {
      res.status(200).send({ "status": true, "message": "volume deleted successfully", "data": volume });
    }
  } catch (err) {
    res.status(500).send({ "status": false, "message": "fail to delete volume", "data": null });
  }
});

// Route to update a volume by ID
app.post('/update_volume/:id', async (req, res) => {
  try {
    const volume = await volumeModel.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true } // Return the updated document
    );
    if (!volume) {
      res.status(404).send({ "status": false, "message": "volume not found", "data": null });
    } else {
      res.status(200).send({ "status": true, "message": "volume updated successfully", "data": volume });
    }
  } catch (err) {
    res.status(500).send({ "status": false, "message": "fail to update volume", "data": null });
  }
});
// Route to update a volume by ID
app.post('/update_volume_position/:id', async (req, res) => {
  try {
    const volume = await volumeModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { dx: req.body.dx, dy: req.body.dy } }, // Update dx and dy fields
      { new: true } // Return the updated document
    );
    if (!volume) {
      res.status(404).send({ "status": false, "message": "volume not found", "data": null });
    } else {
      res.status(200).send({ "status": true, "message": "volume updated successfully", "data": volume });
    }
  } catch (err) {
    res.status(500).send({ "status": false, "message": "fail to update volume", "data": null });
  }
});

// Route to update the currentValue field of a volume by ID
app.post('/update_volume_value/:id', async (req, res) => {
  try {
    const { currentValue } = req.body;

    const volume = await volumeModel.findOneAndUpdate(
      { _id: req.params.id },
      { currentValue }, // Only update the currentValue field
      { new: true } // Return the updated document
    );

    if (!volume) {
      res.status(404).send({ "status": false, "message": "volume not found", "data": null });
    } else {
      res.status(200).send({ "status": true, "message": "currentValue updated successfully", "data": volume });
    }
  } catch (err) {
    res.status(500).send({ "status": false, "message": "fail to update currentValue", "data": null });
  }
});


// Route to list all records
app.get('/list_preset', async (req, res) => {
  try {
    // const volumes = await volumeModel.find().sort({ id: 1 }).lean(); 
    const presets = await presetsModel.find().populate('volumes').lean(); // Sorting by id in ascending order (ASC)
    const createdAt = new Date().toISOString();
    presets.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    if (!presets || presets.length === 0) {
      res.status(404).send({ "status": false, "message": `no presets found `, "data": null });
    } else {
      res.status(200).send({ "status": true, "message": `presets found ${presets.length}`, "createAt": createdAt, "data": presets });
    }
  } catch (err) {
    res.status(500).send({ "status": false, "message": "fail to retrieve presets", "data": null });
  }
});


// Route to get a specific preset by its _id
app.get('/preset_update_volume_value/:id', async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  try {
    const presetId = req.params.id;
    const preset = await presetsModel.findById(presetId).populate('volumes').lean();
    const listVolumeResponse = await axios.get(`${baseUrl}/list_volume?type=0`);
    const volumesFromAPI = listVolumeResponse.data.data;
    console.log(`Data from list_volume APIs:`, volumesFromAPI.length);
    console.log(`Data from preset:`, preset.volumes.length);
    const presetVolumes = preset.volumes;
    const apiVolumes = volumesFromAPI;
    const minLength = Math.min(presetVolumes.length, apiVolumes.length);
    const updatePromises = [];
    for (let i = 0; i < minLength; i++) {
      const presetVolume = presetVolumes[i];
      const apiVolume = apiVolumes[i];
      // Check if the volumes match based on their IDs and names
      if (presetVolume.id.toString() === apiVolume.id.toString()) {
        console.log('APIs volumes id:', apiVolume._id);
        console.log('preset volumes current value:', presetVolume.currentValue);
        // Update currentValue of presetVolume with value from apiVolume
        updatePromises.push(axios.post(`${baseUrl}/update_volume/${apiVolume._id}`, {
          currentValue: presetVolume.currentValue
        }));
      }
    }
    // Execute all update requests in parallel
    await Promise.all(updatePromises);

    if (!preset) {
      return res.status(404).send({ "status": false, "message": `Preset with _id ${presetId} not found`, "data": null });
    }
    return res.status(200).send({ "status": true, "message": `Loaded & Updated all  ${preset.presetName} preset's  volume value  as current successfull`, "data": preset });
  } catch (err) {
    console.error(err);
    res.status(500).send({ "status": false, "message": "Failed to retrieve the preset", "data": null });
  }
});





// create a new preset
app.post('/create_preset', async (req, res) => {
  try {
    const { volumes, presetId, presetName } = req.body;
    const existingRecord = await presetsModel.findOne({ presetId, presetName, });
    if (existingRecord) {
      return res.status(400).send({ "status": false, "message": "A preset with the same id, name  already exists", "data": null });
    }
    const presets = new presetsModel(req.body);
    await presets.save();
    res.status(201).send({ "status": true, "message": "Preset created successfully", "data": presets });
  } catch (err) {
    res.status(500).send({ "status": false, "message": "Internal server error", "data": null });
  }
});

// // create a new preset
// app.post('/create_preset_fix', async (req, res) => {
//   // Get the base URL dynamically
//   const baseUrl = `${req.protocol}://${req.get('host')}`;
//   try {
//     const { presetId, presetName } = req.body;
//     const volumesResponse = await axios.get(`${baseUrl}/list_volume`); // Assuming you're using Axios
//     const volumesData = volumesResponse.data.data;
//     const copiedVolumes = [];
//     for (const volumeData of volumesData) {
//       // Create a copy of the volume with modified properties
//       const copiedVolume = new volumeModel({
//         ...volumeData,
//         _id: mongoose.Types.ObjectId(), // Generate a new ObjectId for the copied volume
//         name: `${volumeData.name} .`, // Modify the name
//         presetId: '', // Initialize presetId as empty
//         type: 1, // Set type to 1
//       });

//       // Save the copied volume
//       await copiedVolume.save();

//       // Push the copied volume to the array
//       copiedVolumes.push(copiedVolume);
//     }

//     const newPreset = new presetsModel({
//       presetId,
//       presetName,
//       volumes: copiedVolumes // Assign the copied volume models to the preset's volumes field
//     });

//     // Save the new preset
//     await newPreset.save();

//     // Update the presetId field for each copied volume
//     for (const copiedVolume of copiedVolumes) {
//       copiedVolume.presetId = newPreset._id; // Set the presetId to the new preset's _id
//       await copiedVolume.save(); // Save the updated volume
//     }

//     res.status(201).send({
//       "status": true,
//       "message": "Preset created successfully",
//       "data": newPreset
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({
//       "status": false,
//       "message": "Internal server error",
//       "data": null
//     });
//   }
// });

app.post('/create_preset_fix', async (req, res) => {
  // Get the base URL dynamically
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  try {
    const { presetId, presetName } = req.body;

    // Get volumes data
    const volumesResponse = await axios.get(`${baseUrl}/list_volume`);
    const volumesData = volumesResponse.data.data;

    // Create copied volumes
    const copiedVolumes = volumesData.map(volumeData => ({
      ...volumeData,
      _id: mongoose.Types.ObjectId(), // Generate a new ObjectId for the copied volume
      name: `${volumeData.name} .`, // Modify the name
      presetId: '', // Initialize presetId as empty
      type: 1 // Set type to 1
    }));

    // Bulk insert copied volumes
    await volumeModel.insertMany(copiedVolumes);

    // Create new preset with copied volumes
    const newPreset = new presetsModel({
      presetId,
      presetName,
      volumes: copiedVolumes.map(volume => volume._id) // Assign the copied volume ids to the preset's volumes field
    });

    // Save the new preset
    await newPreset.save();

    // Bulk update presetId for copied volumes
    await volumeModel.updateMany(
      { _id: { $in: copiedVolumes.map(volume => volume._id) } }, // Filter volumes by their ids
      { presetId: newPreset._id } // Update presetId to the new preset's _id
    );

    res.status(201).send({
      "status": true,
      "message": "Preset created successfully",
      "data": newPreset
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      "status": false,
      "message": "Internal server error",
      "data": null
    });
  }
});


// Route to delete a preset by ID
router.delete('/delete_preset/:presetId', async (req, res) => {
  const { presetId } = req.params;
  try {
    // Find the preset by ID and delete it
    const deletedPreset = await presetsModel.findByIdAndDelete(presetId);
    if (!deletedPreset) {
      // If preset is not found, return 404 Not Found
      return res.status(404).json({ success: false, message: 'Preset not found', data: null });
    }
    // If preset is successfully deleted, return success response
    return res.status(200).json({ success: true, message: `Preset deleted successfully `, data: deletedPreset });
  } catch (error) {
    // If an error occurs during deletion, return 500 Internal Server Error
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});
// Route to delete a volume by ID
app.delete('/delete_preset_all', async (req, res) => {
  try {
    const result = await presetsModel.deleteMany({});
    if (!result) {
      res.status(404).send({ "status": false, "message": "No preset found", "data": null });
    } else {
      res.status(200).send({ "status": true, "message": "All preset deleted successfully", "data": result });
    }
  } catch (err) {
    res.status(500).send({ "status": false, "message": "Failed to delete preset", "data": null });
  }
});

// Route to update a preset by ID
router.put('/update_preset/:presetId', async (req, res) => {
  const { presetId } = req.params;
  const { presetName, volumes } = req.body;

  try {
    // Find the preset by ID
    let preset = await presetsModel.findById(presetId);

    if (!preset) {
      // If preset is not found, return 404 Not Found
      return res.status(404).json({ success: false, message: 'Preset not found' });
    }

    // Update preset properties
    preset.presetName = presetName || preset.presetName;
    preset.volumes = volumes || preset.volumes;

    // Save the updated preset
    preset = await preset.save();

    // Return success response with updated preset
    return res.status(200).json({ success: true, message: 'Preset updated successfully', preset });
  } catch (error) {
    // If an error occurs during update, return 500 Internal Server Error
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});


// Route to update a volume of a preset
app.put('/:presetId/:volumeId', async (req, res) => {
  try {
    const { presetId, volumeId } = req.params;
    const { currentValue } = req.body; // Assuming you want to update the currentValue of the volume

    // Find the preset by ID and update the volume with the matching volume ID
    const updatedPreset = await presetsModel.findOneAndUpdate(
      { _id: presetId, 'volumes._id': volumeId }, // Find the preset by ID and match the volume with the given volumeId
      { $set: { 'volumes.$.currentValue': currentValue } }, // Update the currentValue of the matched volume
      { new: true } // Return the updated document
    ).lean();

    if (!updatedPreset) {
      // If the preset or volume is not found
      return res.status(404).send({ "status": false, "message": "Preset or volume not found" });
    }

    res.status(200).send({ "status": true, "message": "Volume updated successfully", "updatedPreset": updatedPreset });
  } catch (err) {
    res.status(500).send({ "status": false, "message": "Failed to update volume", "error": err });
  }
});



// Route to delete a volume by ID
app.delete('/delete_volume_all', async (req, res) => {
  try {
    const result = await volumeModel.deleteMany({});
    if (!result) {
      res.status(404).send({ "status": false, "message": "No volumes found", "data": null });
    } else {
      res.status(200).send({ "status": true, "message": "All volumes deleted successfully", "data": result });
    }
  } catch (err) {
    res.status(500).send({ "status": false, "message": "Failed to delete volumes", "data": null });
  }
});