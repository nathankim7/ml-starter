import * as tf from '@tensorflow/tfjs'

export function generateData(range, numPoints, coeff, sigma=0.04) {
    return tf.tidy(() => {
        const a = tf.scalar(coeff.a), b = tf.scalar(coeff.b);
        const xs = tf.randomUniform([numPoints], 0, range);
        const ys = a.mul(xs).add(b).add(tf.randomNormal([numPoints], 0, sigma));

        return { xs, ys };
    })
}
