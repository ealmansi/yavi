import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("daily_text_size", workDirectory, sqlContext)

  saveTableCsv("daily_text_size", workDirectory, sqlContext)

}
