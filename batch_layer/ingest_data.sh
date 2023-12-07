#!/bin/bash
hdfs dfs -mkdir /home/hadoop/qiuli_final_project

scp -i ~/.ssh/qiuli_mpcs53014.pem ~/Downloads/NYPD_Arrest_Data__Year_to_Date_Cleaned.csv hadoop@ec2-3-131-137-149.us-east-2.compute.amazonaws.com:/home/hadoop/

hdfs dfs -put /home/hadoop/NYPD_Arrest_Data__Year_to_Date_Cleaned.csv /qiuli_final_project/

hdfs dfs -ls /qiuli_final_project/

echo "finished putting data"
