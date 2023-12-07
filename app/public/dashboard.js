document.addEventListener('DOMContentLoaded', function() {
    function drawPieChart(chartId, chartLabels, chartData, chartTitle) {
        var ctx = document.getElementById(chartId).getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: chartTitle,
                    data: chartData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    function getSexSummary() {
        fetch('/sex_summary').then(function(response) {
            return response.json();
        }).then(function(data) {
            var chartLabels = Object.keys(data);
            var chartData = Object.values(data);
            var summaryHtml = '<h2>Arrest Summary By Sex</h2><table><tr><th>Gender</th><th>Count</th></tr>';
            chartLabels.forEach(function(label, index) {
                summaryHtml += '<tr><td>' + label + '</td><td>' + chartData[index] + '</td></tr>';
            });
            summaryHtml += '</table>';
            document.getElementById('sexSummary').innerHTML = summaryHtml;
            document.getElementById('sexSummary').innerHTML += '<canvas id="sexSummaryChart"></canvas>';
            drawPieChart('sexSummaryChart', chartLabels, chartData, 'Sex Summary');
        }).catch(function(error) {
            console.error('Error:', error);
        });
    }

    function getRealtimeSexSummary() {
        fetch('/sex_summary_realtime').then(function(response) {
            return response.json();
        }).then(function(data) {
            var chartLabels = Object.keys(data);
            var chartData = Object.values(data);
            var summaryHtml = '<h2>Realtime Arrest Summary By Sex</h2><table><tr><th>Gender</th><th>Count</th></tr>';
            chartLabels.forEach(function(label, index) {
                summaryHtml += '<tr><td>' + label + '</td><td>' + chartData[index] + '</td></tr>';
            });
            summaryHtml += '</table>';
            document.getElementById('sexSummary').innerHTML = summaryHtml;
            document.getElementById('sexSummary').innerHTML += '<canvas id="sexSummaryChart"></canvas>';
            drawPieChart('sexSummaryChart', chartLabels, chartData, 'Sex Summary');
        }).catch(function(error) {
            console.error('Error:', error);
        });
    }

    function getAgeSummary() {
        fetch('/age_summary').then(function(response) {
            return response.json();
        }).then(function(data) {
            var chartLabels = Object.keys(data);
            var chartData = Object.values(data);
            var summaryHtml = '<h2>Arrest Summary By Age</h2><table><tr><th>Age Group</th><th>Count</th></tr>';
            chartLabels.forEach(function(label, index) {
                summaryHtml += '<tr><td>' + label + '</td><td>' + chartData[index] + '</td></tr>';
            });
            summaryHtml += '</table>';
            document.getElementById('ageSummary').innerHTML = summaryHtml;
            document.getElementById('ageSummary').innerHTML += '<canvas id="ageSummaryChart"></canvas>';
            drawPieChart('ageSummaryChart', chartLabels, chartData, 'Age Summary');
        }).catch(function(error) {
            console.error('Error:', error);
        });
    }

    function getRealtimeAgeSummary() {
        fetch('/age_summary_realtime').then(function(response) {
            return response.json();
        }).then(function(data) {
            var chartLabels = Object.keys(data);
            var chartData = Object.values(data);
            var summaryHtml = '<h2>Realtime Arrest Summary By Age</h2><table><tr><th>Age Group</th><th>Count</th></tr>';
            chartLabels.forEach(function(label, index) {
                summaryHtml += '<tr><td>' + label + '</td><td>' + chartData[index] + '</td></tr>';
            });
            summaryHtml += '</table>';
            document.getElementById('ageSummary').innerHTML = summaryHtml;
            document.getElementById('ageSummary').innerHTML += '<canvas id="ageSummaryChart"></canvas>';
            drawPieChart('ageSummaryChart', chartLabels, chartData, 'Age Summary');
        }).catch(function(error) {
            console.error('Error:', error);
        });
    }

    function getRaceSummary() {
        fetch('/race_summary').then(function(response) {
            return response.json();
        }).then(function(data) {
            var chartLabels = Object.keys(data);
            var chartData = Object.values(data);
            var summaryHtml = '<h2>Arrest Summary By Race</h2><table><tr><th>Race</th><th>Count</th></tr>';
            chartLabels.forEach(function(label, index) {
                summaryHtml += '<tr><td>' + label + '</td><td>' + chartData[index] + '</td></tr>';
            });
            summaryHtml += '</table>';
            document.getElementById('raceSummary').innerHTML = summaryHtml;
            document.getElementById('raceSummary').innerHTML += '<canvas id="raceSummaryChart"></canvas>';
            drawPieChart('raceSummaryChart', chartLabels, chartData, 'Race Summary');
        }).catch(function(error) {
            console.error('Error:', error);
        });
    }

    function getRealtimeRaceSummary() {
        fetch('/race_summary_realtime').then(function(response) {
            return response.json();
        }).then(function(data) {
            var chartLabels = Object.keys(data);
            var chartData = Object.values(data);
            var summaryHtml = '<h2>Realtime Arrest Summary By Race</h2><table><tr><th>Race</th><th>Count</th></tr>';
            chartLabels.forEach(function(label, index) {
                summaryHtml += '<tr><td>' + label + '</td><td>' + chartData[index] + '</td></tr>';
            });
            summaryHtml += '</table>';
            document.getElementById('raceSummary').innerHTML = summaryHtml;
            document.getElementById('raceSummary').innerHTML += '<canvas id="raceSummaryChart"></canvas>';
            drawPieChart('raceSummaryChart', chartLabels, chartData, 'Race Summary');
        }).catch(function(error) {
            console.error('Error:', error);
        });
    }

    document.getElementById('getSexSummary').addEventListener('click', getSexSummary);
    document.getElementById('getAgeSummary').addEventListener('click', getAgeSummary);
    document.getElementById('getRaceSummary').addEventListener('click', getRaceSummary);

    document.getElementById('getRealtimeSexSummary').addEventListener('click', getRealtimeSexSummary);
    document.getElementById('getRealtimeAgeSummary').addEventListener('click', getRealtimeAgeSummary);
    document.getElementById('getRealtimeRaceSummary').addEventListener('click', getRealtimeRaceSummary);

});
