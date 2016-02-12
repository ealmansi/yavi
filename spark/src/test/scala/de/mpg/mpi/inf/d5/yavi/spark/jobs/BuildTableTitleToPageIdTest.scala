package de.mpg.mpi.inf.d5.wiki.spark.jobs

import org.junit.Test
import org.scalatest.junit.JUnitSuite

import de.mpg.mpi.inf.d5.wiki.spark.JobContextMock
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.TitleToPageId

/**
 * BuildTableTitleToPageIdTest
 */
class BuildTableTitleToPageIdTest extends JUnitSuite {
  @Test
  def testJob(): Unit = {
    // Run job on mock context.
    BuildTableTitleToPageId.runJob(JobContextMock)

    // Materialize result.
    JobContextMock.getDataFrame(TitleToPageId).show(1000)

    // Clear created tables.
    JobContextMock.clear()
  }
}
