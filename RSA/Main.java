import org.apache.commons.codec.binary.Base64;

import javax.crypto.Cipher;
import java.io.ByteArrayOutputStream;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static final String CHARSET = "UTF-8";
    public static final String RSA_ALGORITHM = "RSA";
    public static final int KEY_SIZE = 1024;

    public static Map<String, String> createKeys(){
        //为RSA算法创建一个KeyPairGenerator对象
        KeyPairGenerator kpg;
        try{
            kpg = KeyPairGenerator.getInstance(RSA_ALGORITHM);
        }catch(NoSuchAlgorithmException e){
            throw new IllegalArgumentException("No such algorithm-->[" + RSA_ALGORITHM + "]");
        }

        //初始化KeyPairGenerator对象,密钥长度
        kpg.initialize(KEY_SIZE);
        //生成密匙对
        KeyPair keyPair = kpg.generateKeyPair();
        //得到公钥
        Key publicKey = keyPair.getPublic();
        String publicKeyStr = Base64.encodeBase64String(publicKey.getEncoded());
        //得到私钥
        Key privateKey = keyPair.getPrivate();
        String privateKeyStr = Base64.encodeBase64String(privateKey.getEncoded());
        Map<String, String> keyPairMap = new HashMap<String, String>();
        keyPairMap.put("publicKey", publicKeyStr);
        keyPairMap.put("privateKey", privateKeyStr);

        return keyPairMap;
    }

    public static RSAPublicKey getPublicKey(String publicKey) throws NoSuchAlgorithmException, InvalidKeySpecException {
        //通过X509编码的Key指令获得公钥对象
        KeyFactory keyFactory = KeyFactory.getInstance(RSA_ALGORITHM);
        X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(Base64.decodeBase64(publicKey));
        RSAPublicKey key = (RSAPublicKey) keyFactory.generatePublic(x509KeySpec);
        return key;
    }


    public static RSAPrivateKey getPrivateKey(String privateKey) throws NoSuchAlgorithmException, InvalidKeySpecException {
        //通过PKCS#8编码的Key指令获得私钥对象
        KeyFactory keyFactory = KeyFactory.getInstance(RSA_ALGORITHM);
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(Base64.decodeBase64(privateKey));
        RSAPrivateKey key = (RSAPrivateKey) keyFactory.generatePrivate(pkcs8KeySpec);
        return key;
    }

    public static String privateEncrypt(String data, RSAPrivateKey privateKey){
        try{
            Cipher cipher = Cipher.getInstance(RSA_ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, privateKey);
            return Base64.encodeBase64String(rsaSplitCodec(cipher, Cipher.ENCRYPT_MODE, data.getBytes(CHARSET), privateKey.getModulus().bitLength()));
        }catch(Exception e){
            throw new RuntimeException("加密字符串[" + data + "]时遇到异常", e);
        }
    }


    public static String publicDecrypt(String data, RSAPublicKey publicKey){
        try{
            Cipher cipher = Cipher.getInstance(RSA_ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, publicKey);
            return new String(rsaSplitCodec(cipher, Cipher.DECRYPT_MODE, Base64.decodeBase64(data), publicKey.getModulus().bitLength()), CHARSET);
        }catch(Exception e){
            throw new RuntimeException("解密字符串[" + data + "]时遇到异常", e);
        }
    }

    private static byte[] rsaSplitCodec(Cipher cipher, int opmode, byte[] datas, int keySize){
        int maxBlock = 0;
        if(opmode == Cipher.DECRYPT_MODE){
            maxBlock = keySize / 8;
        }else{
            maxBlock = keySize / 8 - 11;
        }
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int offSet = 0;
        byte[] buff;
        int i = 0;
        try{
            while(datas.length > offSet){
                if(datas.length-offSet > maxBlock){
                    buff = cipher.doFinal(datas, offSet, maxBlock);
                }else{
                    buff = cipher.doFinal(datas, offSet, datas.length-offSet);
                }
                out.write(buff, 0, buff.length);
                i++;
                offSet = i * maxBlock;
            }
        } catch(Exception e){
            e.getMessage();
        }
        byte[] resultDatas = out.toByteArray();
        try {
            out.close();
        } catch(Exception e){
            e.getMessage();
        }
        return resultDatas;
    }
    public static String toHexString(String s)
    {
        String str="";
        for (int i=0;i<s.length();i++)
        {
            int ch = (int)s.charAt(i);
            str += Integer.toHexString(ch);
        }
        return str;
    }
    public static void main (String[] args) throws Exception {
        Map<String, String> keyMap = createKeys();
        //String  publicKey = keyMap.get("publicKey");
        //String  privateKey = keyMap.get("privateKey");

        String  publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCvSghN6hnRnZy38GJknOcbxG8i+PnvRNzyi1B1C8IUUfHYrXtqjb9vT8C5+yahB9Kaud4jd12D3Hjw2otyQCKRDtxqjlGrEbOflN4P3hTXZsn2TqzIg+wI8O6mLiLMlZ86aw5yAg0U5LosHBDK5r5vqEmEZqiBMzhrGFzlkQhbiQIDAQAB";
        String  privateKey = "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAK9KCE3qGdGdnLfwYmSc5xvEbyL4+e9E3PKLUHULwhRR8dite2qNv29PwLn7JqEH0pq53iN3XYPcePDai3JAIpEO3GqOUasRs5+U3g/eFNdmyfZOrMiD7Ajw7qYuIsyVnzprDnICDRTkuiwcEMrmvm+oSYRmqIEzOGsYXOWRCFuJAgMBAAECgYEAhEEASQETH+OiRen54t27RWkNTT67HLtBVUKlntoTQc+eAJTL5FY0lOCAkhIbUC4dyZ3pK6s5BG9JVLgftEENklIOwThWE9naNxx0U5eo3Cm3MMRKikNrQWJpKw4wFxlFYvg5I2wRGrqW3Lso90JpxNVytXw/0HwD4lBMUuA0EQ0CQQDlZDvmE3iZV22QcNnabZ63xJzEFxGXn9fLN2m9khCVEwPS9+8Qq9i47sJ3BQABCorWizUtrUzk3LJWkVMQtdgXAkEAw587nt7eBjOB6hu7JHWL6Qu5xMKWkg96sSmUIq7eptQVLpxtqHnhPpMaZsU2x3EEk1Qma7orQH8x0OI004wNXwJAAiDL7XaAx+tnuM9TNhOORWYtjiQopZ92AQyijn+sZ7Wlc2+ZaC4v9IdChpglR90xLIxeEe5pqDXj8amne6A0QQJAfY9qBDoGhjJvU6WDBA7Sw717+lfvr0ZyON54L57QWIJOKkHLfNTmB3UCAC7bTz4ycqITmxe+hUJe5jUbNSFyvwJBAMPUBURCTcWuVz1aOsRoItGf2ObEo5zE/NQGCIOxTgOzW+1coAZEUt+Fr+/HfQb98VRSHPujf0EJbduCJI2izoU=";

        System.out.println("公钥: \n\r" + publicKey);
        System.out.println("私钥： \n\r" + privateKey);

        System.out.println("私钥加密——公钥解密");
         String str = "{\"domainId\":\"trendygroup\",\"externalUserId\":\"allen.chen\"}";
       // String str = "hello";
        System.out.println("\r明文：\r\n" + str);

        RSAPrivateKey priKey = getPrivateKey(privateKey);
        //System.out.println("第一步：\r\n" + priKey.getPrivateExponent().toString());
        String encodedData = privateEncrypt(str, priKey);
        System.out.println("密文：\r\n" + toHexString(encodedData));
        String decodedData = publicDecrypt(encodedData, getPublicKey(publicKey));
        System.out.println("解密后文字: \r\n" + decodedData);
    }
}