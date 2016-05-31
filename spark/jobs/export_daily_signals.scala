import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("daily_signals", workDirectory, sqlContext)

  saveTableCsv("daily_signals", workDirectory, sqlContext)

}
