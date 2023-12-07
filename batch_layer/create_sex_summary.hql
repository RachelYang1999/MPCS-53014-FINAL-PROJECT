create 'sex_summary_hbase', 'details'

CREATE EXTERNAL TABLE IF NOT EXISTS sex_summary_hbase (
    perp_sex STRING,
    total_arrests BIGINT
)
STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'
WITH SERDEPROPERTIES ("hbase.columns.mapping" = ":key,details:total_arrests")
TBLPROPERTIES ("hbase.table.name" = "sex_summary_hbase");

INSERT OVERWRITE TABLE sex_summary_hbase
SELECT perp_sex, COUNT(*) as total_arrests
FROM temp_nypd_arrests
GROUP BY perp_sex
SORT BY total_arrests DESC;