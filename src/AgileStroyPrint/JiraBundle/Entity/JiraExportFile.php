<?php

namespace AgileStroyPrint\JiraBundle\Entity;

use Symfony\Component\Validator\Constraints as Assert;

class JiraExportFile
{
    /**
     * @Assert\NotBlank(
     *     message = "file.mandatory"
     * )
     * @Assert\File(
     *     maxSize = "1024k",
     *     mimeTypes = {"text/html", "application/vnd.ms-excel", "text/xml"},
     *     mimeTypesMessage = "file.extension"
     * )
     */
    protected $file;

    protected $format;

    public function getFile()
    {
        return strtolower(trim($this->file));
    }
    public function setFile($file)
    {
        $this->file = strtolower(trim($file));
    }
    public function addFile($file)
    {
        $this->file = strtolower(trim($file));
    }
    public function removeFile($file)
    {
    }

    public function getFormat()
    {
        return trim($this->format);
    }
    public function setFormat($format)
    {
        $this->format = trim($format);
    }
}