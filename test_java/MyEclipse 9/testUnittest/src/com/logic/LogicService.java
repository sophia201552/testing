package com.logic;

public class LogicService {
    
    public int add(int x ,int y){ //�ӷ�
        return x+y;
    }
    
    public int sub(int x ,int y){ //����
        return x-y;
    }
    
    public int div(int x ,int y){ //���� 
        return x/y;
    }
    
    public int div2(int x ,int y){ //����  �����쳣�ж�
        try {
            int z = x/y;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return x/y;
    }
    
    public void loop(int x ,int y){ //��ѭ��
        for(;;)
            x=y;
    }    
    
    public void unCompleted(int x ,int y){ //δ��ɵ�ģ��
        //���ڿ�����
    }
    
}