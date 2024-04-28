window.electronAPI.onImgFile(async (_event, value) => {
  const worker = await Tesseract.createWorker("chi_sim", 1, {
    workerPath: "./node_modules/tesseract.js/dist/worker.min.js",
    workerBlobURL: false,
  });
  const {
    data: { text },
  } = await worker.recognize(value.toDataURL());
	await worker.terminate();

  const data = {
    input: {
      messages: [
        {
          role: "user",
          content: `${text}(用javascript实现)`,
        },
      ],
    },
  };
  const res = await fetch("http://127.0.0.1:5000/api/chat", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  const out = await res.text()

	const outJSON = JSON.parse(out)
  document.querySelector('.answer').innerHTML = outJSON.response.output.choices[0].message.content
});
