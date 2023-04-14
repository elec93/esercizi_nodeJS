// Create agetResults function that uses async and await.
// Inside of the function, call the luckyDraw function for each of the players: Tina, Jorge, Julien
// Log out the resolved value for each promise and handle any promise rejections.

function luckyDraw(player) {
  return new Promise((resolve, reject) => {
    const win = Boolean(Math.round(Math.random()));

    process.nextTick(() => {
      if (win) {
        resolve(`${player} won a prize in the draw!`);
      } else {
        reject(new Error(`${player} lost the draw.`));
      }
    });
  });
}

async function getResults() {
  try {
    const tinaRes = await luckyDraw("Tina");
    console.log(tinaRes);
    const jorgeRes = await luckyDraw("Jorge");
    console.log(jorgeRes);
    const julienRes = await luckyDraw("Julien");
    console.log(julienRes);
  } catch (error) {
    console.log('errore:' + error);
  }
}
getResults();