package org.penforge.backend.statistics;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OpenPorts {

    private int http;
    private int smtp;
    private int ftp;
    private int ssh;
    private int smb;
    private int dns;
    private int telnet;
    private int tftp;





}
