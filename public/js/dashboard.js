let breakDownChart = document.getElementById('breakdown-chart')
let historyChart = document.querySelector("#history-chart")

let BD_CHART_LABELS = JSON.parse(breakDownChart.getAttribute('labels'));
let BD_CHART_VALUES = JSON.parse(breakDownChart.getAttribute('values'));

let H_CHART_LABELS = JSON.parse(historyChart.getAttribute('labels'));
let H_CHART_VALUES = JSON.parse(historyChart.getAttribute('values'));

let optionsBreakdown = {
	series: BD_CHART_VALUES,
	labels: BD_CHART_LABELS,
	colors: ['#003F5C', '#58508D', '#BC5090', '#FF6361', '#FFA600'],
	chart: {
		type: 'donut',
		width: '80%',
		height: '240px'
	},
	legend: {
		position: 'right',
		fontWeight: 600,
	},
	plotOptions: {
		pie: {
			donut: {
				size: '45%'
			}
		}
	}
}

var optionsHistory = {
	series: [{
		name: 'history',
		data: H_CHART_VALUES
	}],
	chart: {
		height: 140,
		type: 'area',
		toolbar: {
			show: false,
		},
		sparkline: {
			enabled: true
		}
	},
	colors: ['#5350e9'],
	stroke: {
		width: 2,
	},
	grid: {
		show: false,
	},
	dataLabels: {
		enabled: false
	},
	xaxis: {
		type: 'date',
		categories: H_CHART_LABELS,
		axisBorder: {
			show: false
		},
		axisTicks: {
			show: false
		},
		labels: {
			show: false,
		}
	},
	show: false,
	yaxis: {
		axisBorder: {
			show: false
		},
		labels: {
			show: false,
		},
	},
	tooltip: {
	},
};


var chartBreakdown = new ApexCharts(breakDownChart, optionsBreakdown)
var chartHistory = new ApexCharts(historyChart, optionsHistory);

chartHistory.render();
chartBreakdown.render()

document.getElementById('report-gen').addEventListener("click", function () {
	html2canvas(document.querySelector("#capture")).then(canvas => {

		let width = canvas.width / 2.4;
		let height = canvas.height / 2.4;

		var extra_canvas = document.createElement("canvas");
		extra_canvas.setAttribute('width', width);
		extra_canvas.setAttribute('height', height);
		var ctx = extra_canvas.getContext('2d');
		ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);

		let image = extra_canvas.toDataURL("image/png");
		var html = ""

		html += `<img src="${image}" width=${width} height=${height}  style="margin-bottom:10px;" />`
		html += `<span class="ddxg2 text-dark font-bold" id="uploadtext">Uploading into Google Drive</span>`
		html += `<progress id="progressBar" value="50" max="100" style="width:${width}px;height:15px;"></progress>`

		Swal.fire({
			html: html,
			showCancelButton: false, // There won't be any cancel button
			showConfirmButton: false // There won't be any confirm button
		});


		var token = document.getElementById('report-gen').getAttribute('token')
		progress();
		canvas.toBlob(function (blob) {
			uploadFile(blob, token)
		}, 'image/png', 1);

	});
});


function uploadFile(data, token) {
	var uploadtext = document.getElementById("uploadtext");
	var metadata = {
		'name': 'sample.png',
		'mimeType': 'image/png',
		'parents': ['root'],
	};
	var form = new FormData();
	form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
	form.append('file', data);

	fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
		method: 'POST',
		headers: new Headers({ 'Authorization': 'Bearer ' + token }),
		body: form,
	}).then((res) => {
		uploadtext.innerHTML = "Successfully Uploaded !"
		return res.json();
	}).then(function (val) {
		uploadtext.innerHTML = "Successfully Uploaded !"
	}).catch(err => {
		document.getElementById("progressBar").value = 0;
		uploadtext.innerHTML = "Upload Failed !"
	})
}

function progress() {
	var bar = document.getElementById("progressBar");
	var width = 1;
	var id = setInterval(() => {
		if (width >= 100) {
			clearInterval(id);
		} else {
			width++;
			bar.value = width;
		}
	}, 20);
}
