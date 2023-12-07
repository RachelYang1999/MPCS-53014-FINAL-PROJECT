# MPCS 53014 Big Data Application Architecture
## Final Project: NYPD Arrest Data Dashboard

### Basic Information
- **Student Name**: Qiuli Yang
- **Preferred Name**: Rachel
- **Student ID**: 12368929
- **CNet ID**: qiuli
- **GitHub Link**: [GitHub Repository](#)

### Introduction
This project is a data analysis dashboard based on NYPD Arrest Records, integrating real-time and historical data for insightful arrest patterns in New York City. It utilizes public records from the NYPD (available [here](https://catalog.data.gov/dataset/nypd-arrest-data-year-to-date)), including details on various arrest incidents, offender demographics, and more.

### Technology Stack
- **Frontend**: HTML, CSS, JavaScript (Chart.js)
- **Backend**: Node.js, Express.js
- **Database**: HBase, Hive
- **Message Queue**: Apache Kafka
- **Big Data Processing**: Apache Spark
- **Version Control**: Git

### Layers of the Application
#### Batch Layer
Responsible for handling historical NYPD Arrest Data, it involves data ingestion, cleaning, and storage in HDFS. Processed data is stored in HBase tables for dashboard usage.

- **Data Upload to HDFS**: Transferring the cleaned CSV to HDFS in the cloud.
- **Temporary Hive Table Creation**: Using Hive SQL for data structuring.
- **HBase Tables Creation**: For storing processed data for the dashboard (`sex_summary_hbase`, `age_group_summary_hbase`, `race_summary_hbase`).

#### Speed Layer
Processes real-time data and updates the system with the most current information using Kafka for data ingestion and Apache Spark for data processing.

- **Realtime Data Ingestion**: Using Kafka to ingest new arrest cases.
- **Spark Streaming**: For processing real-time data and updating HBase tables.

#### Serving Layer
Integrates batch-processed historical data and real-time data for efficient query processing and data presentation. It serves data through APIs to the frontend.

- **APIs**: Including `/sex_summary`, `/age_summary`, `/race_summary`, and `/submit-arrest-case`.
- **Frontend Pages**: Dashboard displaying summaries and a page for submitting new arrest cases.

### Conclusion
The NYPD Arrest Data Application offers a comprehensive visualization and analysis tool for NYC arrest data, showcasing a successful integration of big data technologies for batch and real-time processing.

---
Generated on: 12/07/2023
