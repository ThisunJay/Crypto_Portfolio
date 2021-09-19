let optionsVisitorsProfile = {
	series: [60, 35, 67, 65],
	labels: ['BTC', 'ETH', 'EDT', 'LTS'],
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

var optionsEurope = {
	series: [{
		name: 'series1',
		data: [310.54, 800.54, 600.54, 430.54, 540.54, 340.54, 605, 805, 430.54, 540.54, 340.54, 605]
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
		type: 'datetime',
		categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z", "2018-09-19T07:30:00.000Z", "2018-09-19T08:30:00.000Z", "2018-09-19T09:30:00.000Z", "2018-09-19T10:30:00.000Z", "2018-09-19T11:30:00.000Z"],
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

let optionsAmerica = {
	...optionsEurope,
	colors: ['#008b75'],
}
let optionsIndonesia = {
	...optionsEurope,
	colors: ['#dc3545'],
}



var chartVisitorsProfile = new ApexCharts(document.getElementById('chart-visitors-profile'), optionsVisitorsProfile)
var chartEurope = new ApexCharts(document.querySelector("#chart-europe"), optionsEurope);

chartEurope.render();
chartVisitorsProfile.render()