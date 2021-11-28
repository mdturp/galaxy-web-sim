var nr_batches = 200
var base_address = "https://raw.githubusercontent.com/mdturp/galaxy_data/master/"
var sdss_image_address = "http://skyserver.sdss.org/dr16/SkyServerWS/ImgCutout/getjpeg?TaskName=Skyserver.Explore.Image"
var model_weights_address = 'https://raw.githubusercontent.com/mdturp/galaxy_data/master/model_weights/model.json'


function loadImage(ra, dec) {
    return new Promise((resolve, reject) => {
        let address = sdss_image_address + `&ra=${ra}&dec=${dec}` + "&width=256&height=256"

        let display_img = document.getElementById("my_image")
        display_img.style.display = "inline"
        display_img.src = address
        


        let img = new Image(256, 256)
        img.crossOrigin = ""
        img.src = address
        img.onload = () => {
            // create the tensor after the image has loaded
            const fromPixels = tf.browser.fromPixels(img);
            resolve(fromPixels);
        };
        img.onerror = reject;
    });
}

async function predictImage(ra, dec) {
    image = await loadImage(ra, dec);
    const model = await tf.loadLayersModel(model_weights_address);
    console.log(Math.max.apply(Math, Array.from(image.dataSync())))
    const broadcasted = tf.broadcastTo(image, [1, 256, 256, 3])
    const transformed = broadcasted.div(tf.scalar(127.5)).sub(tf.scalar(1))
    const prediction = await model.predict(transformed)
    const prediction_arr = Array.from(prediction.squeeze().dataSync())
    return prediction_arr

}

async function compute_scores(example) {
    var scores = []
    for (var batch = 0; batch < nr_batches; batch++) {
        var feature_batch = `batch_${batch}.json`
        var full_address = base_address + feature_batch
        await d3.json(full_address).then(data => {


            for (var idx = 0; idx < data.length; idx++) {
                scores.push(cosinesim(example, data[idx]))
            }
        });

        chart.update(Math.round((batch+1) / nr_batches*100))

    }
    return scores
}

function cosinesim(A, B) {
    var dotproduct = 0;
    var mA = 0;
    var mB = 0;
    for (i = 0; i < A.length; i++) { 
        dotproduct += (A[i] * B[i]);
        mA += (A[i] * A[i]);
        mB += (B[i] * B[i]);
    }
    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    var similarity = (dotproduct) / ((mA) * (mB)) 
    return similarity;
}

function arg_sort(array) {
    return Array.from(Array(array.length).keys())
        .sort((a, b) => array[a] < array[b] ? -1 : (array[b] < array[a]) | 0).reverse()
}