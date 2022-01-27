const array = [1, 2, 3, 4, 4, 5, 3, 3, 4, 4, 4, 5, 6, 6, 7];

function verifyArray(array) {
    const newArray = [];

    for (let i = 0; i < array.length - 1; i += 1) {
        for (let j = i + 1; j < array.length; j += 1) {
            if (array[i] === array[j] && !newArray.includes(array[i])) {
                newArray.push(array[i]);
            }
        }
    }

    return newArray;
}

console.log(verifyArray(array));