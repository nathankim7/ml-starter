import * as tf from '@tensorflow/tfjs'

const a = tf.variable(tf.scalar(Math.random()))
const b = tf.variable(tf.scalar(Math.random()))
console.log(`${a.dataSync()[0]} ${b.dataSync()[0]}`)

const predict = x => tf.tidy(() => a.mul(x).add(b)) 

const loss = (predictions, labels) => predictions.sub(labels).square().mean()

export function train(xs, ys, iterations=75) {
    const learningRate = 0.5
    const optimizer = tf.train.sgd(learningRate)

    for (let i = 0; i < iterations; i++) {
        optimizer.minimize(() => loss(predict(xs), ys))
    }

    return [a, b];
}
