const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');



async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            // .decodeImage(image, 3)
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat()

        const predictions = model.predict(tensor);
        const score = await predictions.data();
        const confidenceScore = Math.max(...score) * 100;

        const label = confidenceScore > 50 ? "Cancer" : "Non-cancer";

        let explanation, suggestion;

        if (label === 'Cancer') {
            suggestion = "Segera periksa ke dokter!"
        }else {
            suggestion = "Penyakit kanker tidak terdeteksi."
        }

        return { confidenceScore, label, explanation, suggestion };

    } catch (error) {
        throw new InputError(`Terjadi kesalahan dalam melakukan prediksi`)
    }
}

module.exports = predictClassification;

