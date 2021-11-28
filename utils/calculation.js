export function cosinesim(A, B) {
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

export function arg_sort(array) {
    return Array.from(Array(array.length).keys())
        .sort((a, b) => array[a] < array[b] ? -1 : (array[b] < array[a]) | 0).reverse()
}