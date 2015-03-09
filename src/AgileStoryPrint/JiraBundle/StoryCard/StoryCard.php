<?php

namespace AgileStoryPrint\JiraBundle\StoryCard;

use Symfony\Component\HttpFoundation\File\UploadedFile as UploadedFile;
use Symfony\Component\DomCrawler\Crawler as Crawler;

use AgileStoryPrint\JiraBundle\Entity\Stories as Stories;
use AgileStoryPrint\JiraBundle\Entity\Story as Story;

use PhpOffice\PhpExcel\Classses\PHPExcel;

class StoryCard
{
    protected $stories = null;

    function __construct()
    {
        $this->stories = new Stories();
    }

    /**
     * 
     *
     * @param UploadedFile $file ....
     * @return bool ....
     */
    public function getStories()
    {
        return $this->stories->getStories();
    }

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
            try
            {
                $this->stories->addStory(
                    new Story(
                        array(
                            'key'       => $item->key->__toString(),
                            'project'   => $item->project->__toString(),
                            'summary'   => $item->summary->__toString(),
                            'type'      => $item->type->__toString(),
                            'effort'    => $item->xpath('customfields/customfield[customfieldname="Story Points"]/customfieldvalues')[0]->customfieldvalue->__toString(),
                            'link'      => $item->link->__toString()
                        )
                    )
                );
            }
            catch(\Exception $e)
            {}
        }
    }

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

    private function importFromXLS(UploadedFile $uploadedFile)
    {
        // @todo: try to make excel file work
        //throw new \Exception('Not implemented');

        $file = $uploadedFile->openFile();

        //var_dump($sheetData);
    }
}
