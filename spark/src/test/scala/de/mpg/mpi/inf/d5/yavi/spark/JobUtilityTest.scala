package de.mpg.mpi.inf.d5.wiki.spark

import org.junit.Test
import org.scalatest.junit.JUnitSuite

/**
 * JobUtilityTest
 */
class JobUtilityTest extends JUnitSuite {
  @Test
  def testNormalizeWikilink(): Unit = {
    assert(JobUtility.normalizeWikilink("") == "")
    assert(JobUtility.normalizeWikilink(" trim me ") == "trim me")
    assert(JobUtility.normalizeWikilink("A_title_with_underscores_(something)") == "A title with underscores (something)")
    assert(JobUtility.normalizeWikilink("One space too  many") == "One space too many")
    assert(JobUtility.normalizeWikilink(":Starts with colon") == "Starts with colon")
    assert(JobUtility.normalizeWikilink(":::Starts with many colons") == "Starts with many colons")
    assert(JobUtility.normalizeWikilink("A page#A section") == "A page")
    assert(JobUtility.normalizeWikilink("A page|Piped name") == "A page")
    assert(JobUtility.normalizeWikilink("A page#A section|Piped name") == "A page")
  }
}
