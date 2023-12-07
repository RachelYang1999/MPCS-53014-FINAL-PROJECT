create 'age_group_summary_hbase', 'details'

CREATE EXTERNAL TABLE IF NOT EXISTS age_group_summary_hbase (age_group STRING, total_arrests BIGINT)
STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'
WITH SERDEPROPERTIES ("hbase.columns.mapping" = ":key,details:total_arrests")
TBLPROPERTIES ("hbase.table.name" = "age_group_summary");

INSERT OVERWRITE TABLE age_group_summary_hbase
SELECT CONCAT(age_group), total_arrests
FROM (
    SELECT AGE_GROUP, COUNT(*) AS total_arrests
    FROM temp_nypd_arrests
    GROUP BY AGE_GROUP
    ORDER BY total_arrests DESC
) t;



