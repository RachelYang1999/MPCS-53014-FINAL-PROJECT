CREATE TABLE temp_nypd_arrests (
    arrest_key STRING,
    arrest_date STRING,
    pd_cd STRING,
    pd_desc STRING,
    ky_cd STRING,
    ofns_desc STRING,
    law_code STRING,
    law_cat_cd STRING,
    arrest_boro STRING,
    arrest_precinct STRING,
    jurisdiction_code STRING,
    age_group STRING,
    perp_sex STRING,
    perp_race STRING,
    x_coord_cd STRING,
    y_coord_cd STRING,
    latitude STRING,
    longitude STRING,
    georeferenced_column STRING
)
ROW FORMAT DELIMITED
    FIELDS TERMINATED BY ','
STORED AS TEXTFILE;

LOAD DATA INPATH '/qiuli_final_project/NYPD_Arrest_Data__Year_to_Date_Cleaned.csv' INTO TABLE temp_nypd_arrests;
INSERT OVERWRITE TABLE nypd_arrests_hbase
SELECT * FROM temp_nypd_arrests;
