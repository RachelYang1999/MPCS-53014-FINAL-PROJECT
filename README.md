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


### Running the Application

#### Step 1: Accessing the Server
- SSH into the EC2 instance:
  ```bash
  ssh -i {your-key} ec2-user@ec2-3-143-113-170.us-east-2.compute.amazonaws.com
  ```

#### Step 2: Starting the Application
- Navigate to the application directory:
  ```bash
  cd qiuli/app/
  ```
- Run the application using the following command:
  ```bash
  node app.js 3082 ec2-3-131-137-149.us-east-2.compute.amazonaws.com 8070 b-2.mpcs53014kafka.o5ok5i.c4.kafka.us-east-2.amazonaws.com:9092,b-3.mpcs53014kafka.o5ok5i.c4.kafka.us-east-2.amazonaws.com:9092,b-1.mpcs53014kafka.o5ok5i.c4.kafka.us-east-2.amazonaws.com:9092
  ```

#### Step 3: Accessing the Dashboard
- Open a web browser and visit the following URL:
  ```
  http://ec2-3-143-113-170.us-east-2.compute.amazonaws.com:3082/
  ```

#### Step 4: Submitting New Arrest Data
To submit new arrest data and see real-time updates in the dashboard, follow these steps:
- First, SSH into the Hadoop server:
  ```bash
  ssh -i {your-key} -L 8070:ec2-3-131-137-149.us-east-2.compute.amazonaws.com:8070 hadoop@ec2-3-131-137-149.us-east-2.compute.amazonaws.com
  ```
- Navigate to the project's target folder:
  ```bash
  cd /home/hadoop/qiuli/final_project/target
  ```
- Submit the Spark job using the following command. Upon successful submission, you should see a message "Submit successfully in Spark" in the terminal:
  ```bash
  spark-submit --master local[2] --driver-java-options "-Dlog4j.configuration=file:///home/hadoop/ss.log4j.properties" --class StreamArrestCase uber-spark_final_project-1.0-SNAPSHOT.jar b-2.mpcs53014kafka.o5ok5i.c4.kafka.us-east-2.amazonaws.com:9092,b-1.mpcs53014kafka.o5ok5i.c4.kafka.us-east-2.amazonaws.com:9092,b-3.mpcs53014kafka.o5ok5i.c4.kafka.us-east-2.amazonaws.com:9092
  ```

- Return to the dashboard to view new Realtime Data updates.

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

##### Back-End API Specifications

###### 1. Sex Summary (`/sex_summary`)
- **Method:** GET
- **Description:** Retrieves a summary of arrests grouped by the perpetrator's sex, combining data from both batch and speed layers.
- **Response Format:** JSON
- **Sample Response:**
  ```json
  { "F": 30000, "M": 140000, "U": 4000 }
  ```

###### 2. Age Summary (`/age_summary`)
- **Method:** GET
- **Description:** Fetches an aggregated count of arrests by age groups.
- **Response Format:** JSON
- **Sample Response:**
  ```json
  { "<18": 5000, "18-24": 20000, "25-44": 60000, "45-64": 30000, "65+": 1000 }
  ```

###### 3. Race Summary (`/race_summary`)
- **Method:** GET
- **Description:** Provides a summary of arrests categorized by the perpetrator's race.
- **Response Format:** JSON
- **Sample Response:**
  ```json
  { "White": 25000, "Black": 70000, "Asian": 5000, "Hispanic": 40000, "Other": 3000 }
  ```

###### 4. Real-Time Summary APIs (e.g., `/sex_summary_realtime`)
- **Method:** GET
- **Description:** Similar to the above APIs but focuses specifically on real-time data, providing the most current insights.

###### 5. Submit Arrest Case (`/submit-arrest-case`)
- **Method:** POST
- **Description:** Responsible for submitting a new arrest case, sending data to Kafka for real-time processing.
- **Request Body Parameters:**
  - `arrest_key` (String): Unique identifier for the arrest.
  - `arrest_date` (String): Date of the arrest.
  - `ofns_desc` (String): Description of the offense.
  - `age_group` (String): Age group of the perpetrator.
  - `perp_sex` (String): Sex of the perpetrator.
  - `perp_race` (String): Race of the perpetrator.
- **Example Request Body:**
  ```json
  {
    "arrest_key": "123456789",
    "arrest_date": "2023-12-07",
    "ofns_desc": "LARCENY",
    "age_group": "25-44",
    "perp_sex": "M",
    "perp_race": "White"
  }
  ```
- **Response:**
  - **Success:** A JSON object containing a success message.
  - **Error:** An error message for issues like Kafka unavailability or invalid input.
- **Sample Success Response:**
  ```json
  { "message": "Arrest case submitted successfully." }
  ```

- **Frontend Pages**: Dashboard displaying summaries and a page for submitting new arrest cases.

  - Dashboard with data from batch layer (no realtime data included)
    - ![dashboard1.png](img%2Fdashboard1.png)
  - Dashboard with realtime data (integrated both batch layer and speeding layer)
    - ![dashboard2.png](img%2Fdashboard2.png)
  - Submission page for new arrest case data
    - ![submit_case.png](img%2Fsubmit_case.png)
  - Dashboard with updated realtime data from the previous step
    - ![dashboard_updated.png](img%2Fdashboard_updated.png)

### Conclusion
The NYPD Arrest Data Application offers a comprehensive visualization and analysis tool for NYC arrest data, showcasing a successful integration of big data technologies for batch and real-time processing.

