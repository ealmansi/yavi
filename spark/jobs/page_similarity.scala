import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("page_outlinks", workDirectory, sqlContext)

  defineTable("outlink_set", s"""
    SELECT po.outlink
    FROM page_outlinks po
    GROUP BY po.outlink
    HAVING COUNT(*) <= 100
  """, sqlContext)

  defineTable("trimmed_page_outlinks", s"""
    SELECT po.*
    FROM page_outlinks po
    INNER JOIN outlink_set os
    ON po.outlink = os.outlink
  """, sqlContext)

  defineTable("neighbourhood_size", s"""
    SELECT tpo.page_id, COUNT(*) AS size
    FROM trimmed_page_outlinks tpo
    GROUP BY tpo.page_id
  """, sqlContext)

  defineTable("neighbourhood_intersection_size", s"""
    SELECT tpo1.page_id AS page_id_1, tpo2.page_id AS page_id_2, COUNT(*) AS size
    FROM trimmed_page_outlinks tpo1
    INNER JOIN trimmed_page_outlinks tpo2 ON tpo1.outlink = tpo2.outlink
    WHERE tpo1.page_id <> tpo2.page_id
    GROUP BY tpo1.page_id, tpo2.page_id
  """, sqlContext)

  defineTable("page_similarity_full", s"""
    SELECT
      ns1.page_id AS page_id_1,
      ns2.page_id AS page_id_2,
      nis.size / (ns1.size + ns2.size - nis.size) AS score
    FROM neighbourhood_intersection_size nis
    INNER JOIN neighbourhood_size ns1 ON nis.page_id_1 = ns1.page_id
    INNER JOIN neighbourhood_size ns2 ON nis.page_id_2 = ns2.page_id
  """, sqlContext)

  defineTable("page_similarity", s"""
    SELECT page_id_1, page_id_2, score
    FROM (
        SELECT
          page_id_1,
          page_id_2,
          score, 
          rank() OVER (PARTITION BY page_id_1 ORDER BY score DESC) AS rank 
        FROM page_similarity_full ) t
    WHERE rank <= 100
  """, sqlContext)

  saveTable("page_similarity", workDirectory, sqlContext)

}
