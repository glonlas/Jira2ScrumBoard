<?php

namespace AgileStoryPrint\JiraBundle\StoryCard;

use Symfony\Component\HttpFoundation\File\UploadedFile as UploadedFile;
use Symfony\Component\DomCrawler\Crawler as Crawler;

use AgileStoryPrint\JiraBundle\Entity\Stories as Stories;
use AgileStoryPrint\JiraBundle\Entity\Story as Story;

//use PhpOffice\PhpExcel\Classses\PHPExcel;

class StoryCard
{
    const KEY_NAME      = 'Key';
    const ISSUE_NAME    = 'Issue Type';
    const SUMMARY_NAME  = 'Summary';
    const EFFORT_NAME   = 'Story Points';
    const PROJECT_NAME  = 'Project';

    protected $stories = null;

    /**
     * Constructor
     * Init a new Stories object
     *
     * @return void
     */
    function __construct()
    {
        $this->stories = new Stories();
    }

    /**
     * Get stories stored in the Stories object
     *
     * @return array Array of Story object
     */
    public function getStories()
    {
        return $this->stories->getStories();
    }

    /**
     * Import file and find Stories inside
     * This method will select automatically the best way to find stories
     * depending the kind of file uploaded
     *
     * @param UploadedFile $file XML or XLS file from Jira
     * @return bool True if stories found, False in the other case
     */
    public function importFromFile(UploadedFile $file)
    {
        if(
            'text/xml' === $file->getClientMimeType() or
            'text/html' === $file->getClientMimeType()
        )
        {
            $this->importFromXML($file);
        }
        elseif(
            'application/octet-stream' === $file->getClientMimeType() or
            'application/vnd.ms-excel' === $file->getClientMimeType() or
            'application/msexcel' === $file->getClientMimeType() or
            'application/x-msexcel' === $file->getClientMimeType() or
            'application/x-ms-excel' === $file->getClientMimeType() or
            'application/x-excel' === $file->getClientMimeType() or
            'application/x-dos_ms_excel' === $file->getClientMimeType() or
            'application/xls' === $file->getClientMimeType() or
            'application/x-xls' === $file->getClientMimeType() or
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' === $file->getClientMimeType()
        )
        {
            /* 
            Because mine type detection doesn't work perfectly, at this time we don't know
            if the file is a classic XLS or a HTML XLS (XLSx)

            First we try to analyse it as a classical XLS file, if the file isn't an XLS file
            an exception will be thrown and we will try to check it as an HTML file (Jira HTML).

            Finally if the file isn't an Excel or a Jira HTML File an exception will be thrown
            and has to be catch by the parent method.
            */
            try
            {
               $this->importFromXLS($file); 
            }
            catch(\Exception $e)
            {
                $this->importFromHTML($file);
            }
            
        }
        else
        {
            // Delete the temporary file
            unlink($file->getRealPath());
            throw new \Symfony\Component\HttpFoundation\File\Exception\FileException();
        }

        // Delete the temporary file
        unlink($file->getRealPath());

        if(count($this->stories->getStories()) > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * Extract stories from an XML File
     * Stoies will be store into $this->stories
     *
     * @param UploadedFile $uploadedFile Jira File
     * @return void
     */
    private function importFromXML(UploadedFile $uploadedFile)
    {
        // Read the XML file and extract content
        $file = $uploadedFile->openFile();
        $xml = simplexml_load_string(
            $file->fread(
                $file->getSize()
            )
        );

        // Populate stories
        foreach ($xml->xpath('channel/item') as $item)
        {            
            $key        = (count($item->key) > 0) ? $item->key->__toString() : null;
            $project    = (count($item->project) > 0) ? $item->project->__toString() : null;
            $summary    = (count($item->summary) > 0) ? $item->summary->__toString() : null;
            $type       = (count($item->type) > 0) ? $item->type->__toString() : null;
            $link       = (count($item->link) > 0) ? $item->link->__toString() : null;

            $xpathEffort = 'customfields/customfield[customfieldname="Story Points"]/customfieldvalues';
            $effort     = (count($item->xpath($xpathEffort)) > 0) ? $item->xpath($xpathEffort)[0]->customfieldvalue->__toString(): null;

            // The minimal requirement is a story key, a summary and an effort
            if( !is_null($key) && !is_null($summary) && !is_null($effort) )
            {
                $this->stories->addStory(
                    new Story(
                        array(
                            'key'       => $key,
                            'project'   => $project,
                            'summary'   => $summary,
                            'type'      => $type,
                            'effort'    => $effort,
                            'link'      => $link
                        )
                    )
                );  
            }
        }
    }

    /**
     * Extract stories from an HTML File
     * The XLS file from Jira is in à HTML format
     * Stoies will be store into $this->stories
     *
     * @param UploadedFile $uploadedFile Jira File
     * @return void
     */
    private function importFromHTML(UploadedFile $uploadedFile)
    {
        try
        {
            // Read the HTML file and insert it into a HTML crawler
            $file = $uploadedFile->openFile();
            $htmlContent = $file->fread($file->getSize());
            $crawler = new Crawler($htmlContent);

            // Populate stories
            $stories = $crawler->filter('.issuerow')
                               ->reduce(function ($node, $i) {
                                    $this->stories->addStory(
                                        new Story(
                                            array(
                                                'key'       => trim($node->filter('.issue-link')->text()),
                                                'link'      => trim($node->filter('.issue-link')->attr('href')),
                                                'project'   => trim($node->filter('.project')->text()),
                                                'summary'   => trim($node->filter('.summary')->text()),
                                                'type'      => trim($node->filter('.issuetype')->text()),
                                                'effort'    => trim($node->filter('.customfield_10005')->text()) 
                                            )
                                        )
                                    );
                            });
        }
        catch(\Exception $e)
        {
            throw new \Symfony\Component\HttpFoundation\File\Exception\FileException();
        }

    }

    /**
     * Extract stories from an XLS file
     * /!\ Not implemented
     *
     * @param UploadedFile $uploadedFile Jira File
     * @return void
     */
    private function importFromXLS(UploadedFile $uploadedFile)
    {
        $file = $uploadedFile->openFile();

        $objReader = \PHPExcel_IOFactory::createReader(
            \PHPExcel_IOFactory::identify(
                $file->getRealPath()
            )
        );

        $objReader->setReadDataOnly(true);
        $objPHPExcel = $objReader->load($file->getRealPath());

        $sheetData = $objPHPExcel->getActiveSheet()->toArray(
            null,
            true,
            true,
            true
        );

        // Till false, we try to find all mandatory field Title in the row to 
        // determinate in which row the data are
        $colsFound = false;

        // Rows
        foreach ($sheetData as $rowKey => $rowData)
        {    
            // Try to in which columns data are
            if(!$colsFound)
            {                
                // Fields coordonnate
                // Mandatory
                $key         = null;
                $summary     = null;
                $type        = null;

                // Optionnal
                $effort      = null;
                $project     = null;

                // Cols        
                foreach ($rowData as $colKey => $colValue)
                {
                    if($colValue == self::KEY_NAME)
                        $key = $colKey;

                    if($colValue == self::SUMMARY_NAME)
                        $summary = $colKey;

                    if($colValue == self::ISSUE_NAME)
                        $type = $colKey;

                    if($colValue == self::EFFORT_NAME)
                        $effort = $colKey;

                    if($colValue == self::PROJECT_NAME)
                        $project = $colKey;
                }

                // Do we found all mandatory fields?
                if( !is_null($key) &&
                    !is_null($summary) &&
                    !is_null($type)
                )
                {
                    $colsFound = true;
                }
            }
            // Add Story
            elseif( '' != $rowData[$key] &&
                    '' != $rowData[$summary] &&
                    '' != $rowData[$type]
            )
            {
                $this->stories->addStory(
                    new Story(
                        array(
                            'key'       => $rowData[$key],
                            'summary'   => $rowData[$summary],
                            'type'      => $rowData[$type],
                            'project'   => (!is_null($project)) ? $rowData[$project] : null,
                            'effort'    => (!is_null($effort)) ? $rowData[$effort] : null,
                            'link'      => null
                        )
                    )
                );  
            }
        }
    }
}
