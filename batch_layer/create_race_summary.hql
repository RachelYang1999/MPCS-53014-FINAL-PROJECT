create 'race_summary_hbase', 'details'

CREATE EXTERNAL TABLE IF NOT EXISTS race_summary_hbase (
    perp_race STRING,
    total_arrests BIGINT
)
STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'
WITH SERDEPROPERTIES ("hbase.columns.mapping" = ":key,details:total_arrests")
TBLPROPERTIES ("hbase.table.name" = "race_summary_hbase");

INSERT OVERWRITE TABLE race_summary_hbase
SELECT perp_race, COUNT(*) as total_arrests
FROM temp_nypd_arrests
GROUP BY perp_race
ORDER BY total_arrests DESC;
-- Process and store data for race summary
