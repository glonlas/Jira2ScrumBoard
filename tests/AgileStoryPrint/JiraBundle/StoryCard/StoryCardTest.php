<?php

namespace Tests\AgileStoryPrint\JiraBundle\StoryCard;

use Symfony\Component\HttpFoundation\File\UploadedFile as UploadedFile;
use AgileStoryPrint\JiraBundle\StoryCard\StoryCard;

/**
 * Unit test for the application utils.
 *
 * See http://symfony.com/doc/current/book/testing.html#unit-tests
 *
 * Execute the application tests using this command (requires PHPUnit to be installed):
 *
 *     $ phpunit tests/AgileStoryPrint/JiraBundle/StoryCard/StoryCardTest.php
 */
class StoryCardTest extends \PHPUnit_Framework_TestCase
{
    const FIXTURE_PATH = 'tests/AgileStoryPrint/JiraBundle/Resources/Fixtures';
    const FOLDER_XML   = '/xml/';
    const FOLDER_XLS   = '/xls-html/';
    const FOLDER_TMP   = '/tmp/';
    const FILE_XML     = 'fixture-success-2-stories.xml';
    const FILE_XLS     = 'excel-all-fields.xlsx';
    const FILE_WRONG   = 'wrong-file.txt';
    
    /**
     * Call protected/private method of a class.
     *
     * @param object &$object    Instantiated object that we will run method on.
     * @param string $methodName Method name to call
     * @param array  $parameters Array of parameters to pass into method.
     *
     * @return mixed Method return.
     */
    protected function invokeMethod(&$object, $methodName, array $parameters = array())
    {
        $reflection = new \ReflectionClass(get_class($object));
        $method = $reflection->getMethod($methodName);
        $method->setAccessible(true);

        return $method->invokeArgs($object, $parameters);
    }

    protected function checkStoriesFromXML($stories)
    {
        // We have two stories in the file
        $this->assertCount(2, $stories);

        // Test the first Story
        $this->assertArrayHasKey('ID-3604', $stories);
        $this->assertEquals('ID-3604', $stories['ID-3604']->getKey());
        $this->assertEquals('A great project', $stories['ID-3604']->getProject());
        $this->assertEquals('Add a contact form', $stories['ID-3604']->getSummary());
        $this->assertEquals('Story', $stories['ID-3604']->getType());
        $this->assertEquals('5', $stories['ID-3604']->getEffort());
        $this->assertEquals('https://jira.yourdomain.tld/browse/ID-3604', $stories['ID-3604']->getLink());
        $this->assertEquals('Proof of concept', $stories['ID-3604']->getVersion());
        $this->assertEquals('ID-3603', $stories['ID-3604']->getEpic());

        // Test the second Story
        $this->assertArrayHasKey('ID-3605', $stories);
        $this->assertEquals('ID-3605', $stories['ID-3605']->getKey());
        $this->assertEquals('A great project', $stories['ID-3605']->getProject());
        $this->assertEquals('Unsubscribe from the mailing list', $stories['ID-3605']->getSummary());
        $this->assertEquals('Story', $stories['ID-3605']->getType());
        $this->assertEquals('2', $stories['ID-3605']->getEffort());
        $this->assertEquals('https://jira.yourdomain.tld/browse/ID-3605', $stories['ID-3605']->getLink());
        $this->assertEquals('Proof of concept', $stories['ID-3605']->getVersion());
        $this->assertEquals('ID-3603', $stories['ID-3605']->getEpic());
    }

    protected function checkStoriesFromXLS($stories)
    {
        // We have two stories in the file
        $this->assertCount(2, $stories);

        // Test the first Story
        $this->assertArrayHasKey('ID-3604', $stories);
        $this->assertEquals('ID-3604', $stories['ID-3604']->getKey());
        $this->assertEquals('A great project', $stories['ID-3604']->getProject());
        $this->assertEquals('Add a contact form', $stories['ID-3604']->getSummary());
        $this->assertEquals('Story', $stories['ID-3604']->getType());
        $this->assertEquals('5', $stories['ID-3604']->getEffort());
        $this->assertEquals(null, $stories['ID-3604']->getLink());
        $this->assertEquals('Proof of concept', $stories['ID-3604']->getVersion());
        $this->assertEquals('ID-3603', $stories['ID-3604']->getEpic());

        // Test the second Story
        $this->assertArrayHasKey('ID-3605', $stories);
        $this->assertEquals('ID-3605', $stories['ID-3605']->getKey());
        $this->assertEquals('A great project', $stories['ID-3605']->getProject());
        $this->assertEquals('Unsubscribe from the mailing list', $stories['ID-3605']->getSummary());
        $this->assertEquals('Story', $stories['ID-3605']->getType());
        $this->assertEquals('2', $stories['ID-3605']->getEffort());
        $this->assertEquals(null, $stories['ID-3605']->getLink());
        $this->assertEquals('Proof of concept', $stories['ID-3605']->getVersion());
        $this->assertEquals('ID-3603', $stories['ID-3605']->getEpic());
    }
    public function testImportFromXML()
    {
        // Create the fixture
        $filename = self::FILE_XML;
        $path     = self::FIXTURE_PATH . self::FOLDER_XML . $filename;
        $uploadedFile = new UploadedFile($path, $filename);

        // Initiate the class
        $storyCard = new StoryCard();
        $this->invokeMethod($storyCard, 'importFromXML', array($uploadedFile));
        $stories = $storyCard->getStories();

        $this->checkStoriesFromXML($stories);
    }

    public function testImportFromXLS()
    {
        // Create the fixture
        $filename = self::FILE_XLS;
        $path     = self::FIXTURE_PATH . self::FOLDER_XLS . $filename;
        $uploadedFile = new UploadedFile($path, $filename);

        // Initiate the class
        $storyCard = new StoryCard();
        $this->invokeMethod($storyCard, 'importFromXLS', array($uploadedFile));
        $stories = $storyCard->getStories();

        $this->checkStoriesFromXLS($stories);
    }

    public function testImportFromFileXML()
    {
        // Duplicate the file for the test
        // because the method importFromFile delete the file at the end of the process
        $filename      = self::FILE_XML;
        $original_path = self::FIXTURE_PATH . self::FOLDER_XML;
        $new_path      = self::FIXTURE_PATH . self::FOLDER_TMP;

        copy(
            $original_path.$filename,
            $new_path.$filename
        );

        // Create the fixture
        $uploadedFile = new UploadedFile(
            $new_path.$filename, 
            $filename,
            'text/xml'
        );

        // Initiate the class
        $storyCard = new StoryCard();
        $result = $storyCard->importFromFile($uploadedFile);
        $stories = $storyCard->getStories();

        $this->assertTrue($result);
        $this->checkStoriesFromXML($stories);
    }

    public function testImportFromFileXLS()
    {
        // Duplicate the file for the test
        // because the method importFromFile delete the file at the end of the process
        $filename      = self::FILE_XLS;
        $original_path = self::FIXTURE_PATH . self::FOLDER_XLS;
        $new_path      = self::FIXTURE_PATH . self::FOLDER_TMP;

        copy(
            $original_path.$filename,
            $new_path.$filename
        );

        // Create the fixture
        $uploadedFile = new UploadedFile(
            $new_path.$filename, 
            $filename,
            'application/xls'
        );

        // Initiate the class
        $storyCard = new StoryCard();
        $result = $storyCard->importFromFile($uploadedFile);
        $stories = $storyCard->getStories();

        $this->assertTrue($result);
        $this->checkStoriesFromXLS($stories);
    }

    /**
     * @expectedException Symfony\Component\HttpFoundation\File\Exception\FileException
     */
    public function testImportFromFileWrongFile()
    {
        // Duplicate the file for the test
        // because the method importFromFile delete the file at the end of the process
        $filename      = self::FILE_WRONG;
        $original_path = self::FIXTURE_PATH;
        $new_path      = self::FIXTURE_PATH . self::FOLDER_TMP;

        copy(
            $original_path.'/'.$filename,
            $new_path.'/'.$filename
        );

        // Create the fixture
        $uploadedFile = new UploadedFile(
            $new_path.$filename, 
            $filename,
            'text/txt'
        );

        // Initiate the class
        $storyCard = new StoryCard();
        $result = $storyCard->importFromFile($uploadedFile);
    }

    /**
     * @expectedException Symfony\Component\HttpFoundation\File\Exception\FileException
     */
    public function testImportFromFileIncompleteXML()
    {
        // Duplicate the file for the test
        // because the method importFromFile delete the file at the end of the process
        $filename      = 'fixture-fail-incomplete-file.xml';
        $original_path = self::FIXTURE_PATH . self::FOLDER_XML;
        $new_path      = self::FIXTURE_PATH . self::FOLDER_TMP;

        copy(
            $original_path.'/'.$filename,
            $new_path.'/'.$filename
        );

        // Create the fixture
        $uploadedFile = new UploadedFile(
            $new_path.$filename, 
            $filename,
            'text/xml'
        );

        // Initiate the class
        $storyCard = new StoryCard();
        $result = $storyCard->importFromFile($uploadedFile);
    }

    public function testImportFromFileXMLMissingID()
    {
        // Duplicate the file for the test
        // because the method importFromFile delete the file at the end of the process
        $filename      = 'fixture-fail-missing-id-field.xml';
        $original_path = self::FIXTURE_PATH . self::FOLDER_XML;
        $new_path      = self::FIXTURE_PATH . self::FOLDER_TMP;

        copy(
            $original_path.'/'.$filename,
            $new_path.'/'.$filename
        );

        // Create the fixture
        $uploadedFile = new UploadedFile(
            $new_path.$filename, 
            $filename,
            'text/xml'
        );

        // Initiate the class
        $storyCard = new StoryCard();
        $result = $storyCard->importFromFile($uploadedFile);

        $this->assertFalse($result);
    }
}
