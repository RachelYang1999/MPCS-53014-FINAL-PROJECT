import org.apache.kafka.common.serialization.StringDeserializer
import org.apache.spark.SparkConf
import org.apache.spark.streaming._
import org.apache.spark.streaming.kafka010.ConsumerStrategies.Subscribe
import org.apache.spark.streaming.kafka010.LocationStrategies.PreferConsistent
import org.apache.spark.streaming.kafka010._
import com.fasterxml.jackson.databind.{DeserializationFeature, ObjectMapper}
import com.fasterxml.jackson.module.scala.experimental.ScalaObjectMapper
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import org.apache.hadoop.conf.Configuration
import org.apache.hadoop.hbase.TableName
import org.apache.hadoop.hbase.HBaseConfiguration
import org.apache.hadoop.hbase.client.ConnectionFactory
import org.apache.hadoop.hbase.client.Put
import org.apache.hadoop.hbase.util.Bytes

object StreamArrestCase {
  val mapper = new ObjectMapper()
  mapper.registerModule(DefaultScalaModule)
  mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
  val hbaseConf: Configuration = HBaseConfiguration.create()
  hbaseConf.set("hbase.zookeeper.property.clientPort", "2181")
  hbaseConf.set("hbase.zookeeper.quorum", "localhost")

  val hbaseConnection = ConnectionFactory.createConnection(hbaseConf)
  val table = hbaseConnection.getTable(TableName.valueOf("realtime_arrest_case_hbase"))

  def main(args: Array[String]) {
    if (args.length < 1) {
      System.err.println("Usage: StreamArrestCase <brokers>")
      System.exit(1)
    }

    val Array(brokers) = args

    val sparkConf = new SparkConf().setAppName("StreamArrestCase")
    val ssc = new StreamingContext(sparkConf, Seconds(2))

    val topicsSet = Set("mpcs53014_qiuli_final_project")
    val kafkaParams = Map[String, Object](
      "bootstrap.servers" -> brokers,
      "key.deserializer" -> classOf[StringDeserializer],
      "value.deserializer" -> classOf[StringDeserializer],
      "group.id" -> "arrest-case-group",
      "auto.offset.reset" -> "latest",
      "enable.auto.commit" -> (false: java.lang.Boolean)
    )

    val stream = KafkaUtils.createDirectStream[String, String](
      ssc, PreferConsistent,
      Subscribe[String, String](topicsSet, kafkaParams)
    )

    val serializedRecords = stream.map(_.value)
    val reports = serializedRecords.map(rec => mapper.readValue(rec, classOf[ArrestCaseReport]))

    //    val reports = serializedRecords.map(rec => mapper.readValue[SexSummaryReport](rec.getBytes("UTF-8")))
    System.out.println(reports)
    reports.foreachRDD { rdd =>
      rdd.foreach { report =>
        val put = new Put(Bytes.toBytes(report.arrest_key))
        put.addColumn(Bytes.toBytes("details"), Bytes.toBytes("arrest_date"), Bytes.toBytes(report.arrest_date))
        put.addColumn(Bytes.toBytes("details"), Bytes.toBytes("ofns_desc"), Bytes.toBytes(report.ofns_desc))
        put.addColumn(Bytes.toBytes("details"), Bytes.toBytes("age_group"), Bytes.toBytes(report.age_group))
        put.addColumn(Bytes.toBytes("details"), Bytes.toBytes("perp_sex"), Bytes.toBytes(report.perp_sex))
        put.addColumn(Bytes.toBytes("details"), Bytes.toBytes("perp_race"), Bytes.toBytes(report.perp_race))
        table.put(put)
      }
    }
    System.out.println("Submit successfully in Spark")
    ssc.start()
    ssc.awaitTermination()
  }
}
